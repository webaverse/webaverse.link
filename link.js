import storage from './storage.js';
import bip39 from './bip39.js';
import hdkeySpec from './hdkey.js';
const hdkey = hdkeySpec.default;

(async () => {
  const loginToken = await storage.get('loginToken');
  console.log('got', loginToken);
  const mnemonic = loginToken ? loginToken.mnemonic : null;

  const headerEl = document.getElementById('header');
  const headerMessageEl = document.getElementById('header-message');
  const devicesEl = document.getElementById('devices');
  const device1El = document.getElementById('device-1');
  const device2El = document.getElementById('device-2');
  const ok1El = document.getElementById('ok-1');
  const ok2El = document.getElementById('ok-2');
  const failEl = document.getElementById('fail');

  if (mnemonic) {
    const wallet = hdkey.fromMasterSeed(bip39.mnemonicToSeedSync(mnemonic)).derivePath(`m/44'/60'/0'/0/0`).getWallet();
    const address = wallet.getAddressString();
    headerMessageEl.innerText = `Logged in as: ${address}`;

    device1El.classList.remove('disabled');
    device1El.addEventListener('click', async () => {
      const res = await fetch(`https://login.exokit.org?autoip=src&mnemonic=${mnemonic}`, {
        method: 'POST',
      });
      if (res.ok) {
        const j = await res.json();
        console.log('got auto login src', j);

        headerEl.classList.add('hidden');
        devicesEl.classList.add('hidden');
        ok1El.classList.remove('hidden');
      } else {
        console.warn(res.status);
      }
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
      await storage.set('loginToken', {mnemonic});

      headerEl.classList.add('hidden');
      devicesEl.classList.add('hidden');
      ok2El.classList.remove('hidden');

      window.location.href = `https://app.websaverse.com`;
    } else {
      console.warn(res.status);
    }
  });
})();