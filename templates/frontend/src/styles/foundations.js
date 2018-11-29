export default function foundations() {
  const foundations = document.createElement('style')
  foundations.innerHTML = `
    body {
      min-height: 100vh;
    }
    * {
      box-sizing: border-box;
    }
  `
  return foundations
}
