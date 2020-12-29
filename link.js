import storage from './storage.js';

(async () => {
  const loginToken = await storage.get('loginToken');
  console.log('got login token', loginToken);
})();

document.getElementById('device-1').addEventListener('click', async () => {
  const res = await fetch(`https://login.exokit.org?autoip=src`, {
    method: 'POST',
    body: JSON.stringify({
      mnemonic: 'lol',
    }),
  });
  const j = await res.json();
  console.log('got auto login src', j);
});
document.getElementById('device-2').addEventListener('click', async () => {
  const res = await fetch(`https://login.exokit.org?autoip=dst`, {
    method: 'POST',
  });
  const j = await res.json();
  console.log('got auto login dst', j);
});