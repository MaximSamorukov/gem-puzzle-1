const inputsArea = document.getElementById('main-game');
const mobile = /iPad|iPhone|mobile|android|webos|ios|iPod/i.test(navigator.userAgent);
const DELAY_CLICK = 150;
const TIMEOUT = 100;
let isMoved = false;

const moveInputs = (e) => {
  setTimeout(() => {
    isMoved = false;
  }, 150);
  if (isMoved) return;
  const draggable = e.target;
  if (!draggable.classList.contains('draggable')) return;
  draggable.ondragstart = () => false;
  if (mobile) document.body.style.overflow = 'hidden';
  e.preventDefault();

  const inputs = [...inputsArea.getElementsByTagName('input')];
  const allIdx = inputs.map((el) => el.value);
  const idx = allIdx.findIndex((el) => draggable.value === el);
  const len = allIdx.length;
  const rowLen = Math.sqrt(len);
  const draggWidth = draggable.offsetWidth;
  const draggHeight = draggable.offsetHeight;

  const handlerClick = (moveX, moveY, shiftA, shiftB, cb) => {
    const timer = performance.now();
    const resetStyles = () => {
      draggable.style.transition = 'all 0s';
      draggable.style.top = '0';
      draggable.style.left = '0';
    };
    resetStyles();
    const draggLeft = draggable.getBoundingClientRect().left;
    const draggTop = draggable.getBoundingClientRect().top;
    const shiftX = (e.clientX || e.touches[0].clientX) - draggLeft;
    const shiftY = (e.clientY || e.touches[0].clientY) - draggTop;

    const changePosition = (top, left) => {
      draggable.style.transition = '';
      draggable.style.top = `${top}px`;
      draggable.style.left = `${left}px`;
      setTimeout(resetStyles, TIMEOUT);
    };

    draggable.style.position = 'relative';
    draggable.style.zIndex = '0';

    const moveTo = (x, y) => {
      let posX = moveX ? x - draggLeft - shiftX : 0;
      let posY = moveY ? y - draggTop - shiftY : 0;// + top;

      if (moveX) {
        posX = posX <= shiftA ? shiftA : posX;
        posX = posX >= shiftB ? shiftB : posX;
      }

      if (moveY) {
        posY = posY <= shiftA ? shiftA : posY;
        posY = posY >= shiftB ? shiftB : posY;
      }

      draggable.style.left = `${posX}px`;
      draggable.style.top = `${posY}px`;
    };

    let x = mobile ? e.touches[0].clientX : e.clientX;
    let y = mobile ? e.touches[0].clientY : e.clientY;
    moveTo(x, y);

    const moveAt = (event) => {
      x = mobile ? event.touches[0].clientX : event.clientX;
      y = mobile ? event.touches[0].clientY : event.clientY;
      moveTo(x, y);
    };
    const drop = () => {
      cb(performance.now() - timer, changePosition);
      if (mobile) {
        document.removeEventListener('touchmove', moveAt);
        document.removeEventListener('touchend', drop);
        document.body.style.overflow = '';
      } else {
        document.removeEventListener('mousemove', moveAt);
        document.removeEventListener('mouseup', drop);
      }
    };

    if (mobile) {
      document.addEventListener('touchmove', moveAt);
      document.addEventListener('touchend', drop);
    } else {
      document.addEventListener('mousemove', moveAt);
      document.addEventListener('mouseup', drop);
    }
  };

  const swap = (shift) => {
    setTimeout(() => {
      [inputs[idx], inputs[idx - shift]] = [inputs[idx - shift], inputs[idx]];
      inputsArea.append(...inputs);
      isMoved = false;
      draggable.removeAttribute('style');
    }, TIMEOUT);
  };

  const swapLeft = () => {
    isMoved = true;
    const cb = (delay, changePosition) => {
      if (delay < DELAY_CLICK) {
        changePosition(0, -draggWidth);
        swap(1);
      } else {
        const left = Math.abs(parseInt(draggable.style.left, 10));
        if (left < draggWidth / 2) {
          changePosition(0, 0);
        } else {
          changePosition(0, -draggWidth);
          swap(1);
        }
      }
    };
    handlerClick(true, false, -draggWidth, 0, cb);
  };

  const swapRight = () => {
    isMoved = true;
    const cb = (delay, changePosition) => {
      if (delay < DELAY_CLICK) {
        changePosition(0, draggWidth);
        swap(-1);
      } else {
        const left = Math.abs(parseInt(draggable.style.left, 10));
        if (left < draggWidth / 2) {
          changePosition(0, 0);
        } else {
          changePosition(0, draggWidth);
          swap(-1);
        }
      }
    };
    handlerClick(true, false, 0, draggWidth, cb);
  };

  const swapDown = () => {
    isMoved = true;
    const cb = (delay, changePosition) => {
      if (delay < DELAY_CLICK) {
        changePosition(draggHeight, 0);
        swap(-rowLen);
      } else {
        const top = Math.abs(parseInt(draggable.style.top, 10));
        if (top < draggHeight / 2) {
          changePosition(0, 0);
        } else {
          changePosition(draggHeight, 0);
          swap(-rowLen);
        }
      }
    };
    handlerClick(false, true, 0, draggHeight, cb);
  };

  const swapUp = () => {
    isMoved = true;
    const cb = (delay, changePosition) => {
      if (delay < DELAY_CLICK) {
        changePosition(-draggHeight, 0);
        swap(rowLen);
      } else {
        const top = Math.abs(parseInt(draggable.style.top, 10));
        if (top < draggHeight / 2) {
          changePosition(0, 0);
        } else {
          changePosition(-draggHeight, 0);
          swap(rowLen);
        }
      }
    };
    handlerClick(false, true, -draggHeight, 0, cb);
  };


  if (inputs[idx - 1] && !inputs[idx - 1].value) {
    swapLeft();
    return;
  }

  if (inputs[idx - rowLen] && !inputs[idx - rowLen].value) {
    swapUp();
    return;
  }

  if (inputs[idx + rowLen] && !inputs[idx + rowLen].value) {
    swapDown();
    return;
  }

  if (inputs[idx + 1] && !inputs[idx + 1].value) {
    swapRight();
  }
};

const gameMode = document.getElementById('game-mode');

gameMode.addEventListener('click', (e) => {
  const mode = e.target;
  const setAreaSize = (size, className) => {
    const inputs = [];
    for (let i = size; i--;) {
      inputs.push(`<input type="button" class="draggable" value="${i + 1}">`);
    }
    inputs.push('<input type="button" class="empty" value="">');
    inputsArea.innerHTML = inputs.join('');
    inputsArea.className = `main-game ${className}`;
  };

  if (mode.tagName !== 'INPUT') return;
  switch (mode.value) {
    case '3x3': setAreaSize(8, 'three'); break;
    case '4x4': setAreaSize(15, ''); break;
    case '5x5': setAreaSize(24, 'five'); break;
    case '6x6': setAreaSize(35, 'six'); break;
    case '7x7': setAreaSize(48, 'seven'); break;
    case '8x8': setAreaSize(63, 'eight'); break;
  }
});

if (mobile) {
  inputsArea.addEventListener('touchstart', moveInputs);
} else {
  inputsArea.addEventListener('mousedown', moveInputs);
}
