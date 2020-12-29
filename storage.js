const localstorageHost = 'https://localstorage.webaverse.com';

function makePromise() {
  let accept, reject;
  const p = new Promise((a, r) => {
    accept = a;
    reject = r;
  });
  p.accept = accept;
  p.reject = reject;
  return p;
}

let ids = 0;
const loadPromise = new Promise((accept, reject) => {
  const iframe = document.createElement('iframe');
  iframe.onload = () => {
    const channel = new MessageChannel();
    iframe.contentWindow.postMessage({
      _localstorage: true,
      port: channel.port2,
    }, '*', [channel.port2]);
    channel.port1.start();
    accept(channel.port1);
  };
  iframe.onerror = reject;
  iframe.src = localstorageHost;
  iframe.setAttribute('frameborder', 0);
  iframe.style.position = 'absolute';
  iframe.style.top = '-4096px';
  iframe.style.left = '-4096px';
  document.body.appendChild(iframe);
});

const storage = {
  get(key) {
    return loadPromise.then(port => new Promise((accept, reject) => {
      const _message = e => {
        const j = e.data;
        if (j.id === id) {
          port.removeEventListener('message', _message);
          accept(j.result);
        }
      };
      port.addEventListener('message', _message);
      const id = ++ids;
      port.postMessage({
        method: 'get',
        id,
        key,
      });
    }));
  },
  set(key, value) {
    return loadPromise.then(port => new Promise((accept, reject) => {
      const _message = e => {
        const j = e.data;
        if (j.id === id) {
          port.removeEventListener('message', _message);
          accept(j.result);
        }
      };
      port.addEventListener('message', _message);
      const id = ++ids;
      port.postMessage({
        method: 'set',
        id,
        key,
        value,
      });
    }));
  },
  remove(key) {
    return loadPromise.then(port => new Promise((accept, reject) => {
      const _message = e => {
        const j = e.data;
        if (j.id === id) {
          port.removeEventListener('message', _message);
          accept(j.result);
        }
      };
      port.addEventListener('message', _message);
      const id = ++ids;
      port.postMessage({
        method: 'remove',
        id,
        key,
      });
    }));
  },
};
export default storage;
