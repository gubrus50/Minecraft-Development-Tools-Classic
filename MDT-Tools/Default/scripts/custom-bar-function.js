window.onload = function () {
    var grip = document.getElementById('grip'),
        oX, oY,
        mouseDown = function (e) {
            if (e.offsetY + e.offsetX < 0) return;
            oX = e.screenX;
            oY = e.screenY;
            window.addEventListener('mousemove', mouseMove);
            window.addEventListener('mouseup', mouseUp);
        },
        mouseMove = function (e) {
            window.moveTo(screenX + e.screenX - oX, screenY + e.screenY - oY);
            oX = e.screenX;
            oY = e.screenY;
        },
        gripMouseMove = function (e) {
            this.style.cursor = (e.offsetY + e.offsetX > -1);
        },
        mouseUp = function (e) {
            window.removeEventListener('mousemove', mouseMove);
            window.removeEventListener('mouseup', mouseUp);
        };
    grip.addEventListener('mousedown', mouseDown);
    grip.addEventListener('mousemove', gripMouseMove);
}