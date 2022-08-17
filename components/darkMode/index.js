const btn = document.getElementById('modeBtn')
btn.addEventListener('click', () => {
    const body = document.body
    if (body.className !== 'night') {
        body.className = 'night'
    } else {
        body.className = '';
    }
})