import storage from './storage.js';

(async () => {
  const loginToken = await storage.get('loginToken');
  const mnemonic = loginToken ? loginToken.mnemonic : null;

  const device1El = document.getElementById('device-1');
  const device2El = document.getElementById('device-2');

  if (mnemonic) {
    device1El.classList.remove('disabled');
    device1El.addEventListener('click', async () => {
      const res = await fetch(`https://login.exokit.org?autoip=src&mnemonic=${mnemonic}`, {
        method: 'POST',
        body: JSON.stringify({
          mnemonic: 'lol',
        }),
      });
      const j = await res.json();
      console.log('got auto login src', j);
    });
  }
  device2El.addEventListener('click', async () => {
    const res = await fetch(`https://login.exokit.org?autoip=dst`, {
      method: 'POST',
    });
    if (res.ok) {
      const j = await res.json();
      console.log('got auto login dst', j);
      const {mnemonic} = j;
      await storage.set('loginToken', JSON.stringify({mnemonic}));
    } else {
      console.warn(res.status);
    }
  });
})();