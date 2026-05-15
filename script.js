(function () {

  // 这部分负责根据窗口大小动态调整像素图的显示尺寸，保持像素风格的同时适应不同屏幕。

  // ***** 配置所有像素图 *****
  const items = [
    { 
      id: 'home-pixelTitle', 
      originalWidth: 96,        // 原图宽度（用于计算倍数）
      originalHeight: 32,        // 原图高度（用于计算倍数）
      targetHeightRatio: 0.15,    // 目标高度占窗口高度的比例
      maxWidthRatio: 0.8         // 最大宽度占窗口宽度的比例（防止太宽）
    },
    { 
      id: 'home-catBg', 
      originalWidth: 160, 
      originalHeight: 120,
      targetHeightRatio: 0.4,
      maxWidthRatio: 0.9
    },
    {
      id: 'home-pixelSubtitle',
      originalWidth: 288,
      originalHeight: 80,
      targetHeightRatio: 0.1,
      maxWidthRatio: 0.8
    }
    // 继续追加...
  ];

  function updateImage(item) {
    const img = document.getElementById(item.id);
    if (!img) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // 1. 根据目标高度比例计算理想倍数（步长 0.5，至少 1）
    const targetHeight = vh * item.targetHeightRatio;
    let scale = Math.round((targetHeight / item.originalHeight) * 2) / 2;
    if (scale < 1) scale = 1;

    // 2. 宽度上限约束：缩放后的宽度不能超过窗口宽度的 maxWidthRatio
    if (item.maxWidthRatio) {
      const maxWidth = vw * item.maxWidthRatio;
      const maxScaleByWidth = Math.floor((maxWidth / item.originalWidth) * 2) / 2;
      if (maxScaleByWidth < 1) maxScaleByWidth = 1;
      scale = Math.min(scale, maxScaleByWidth);
    }

    // 3. 在 0.5 步长内尝试让高度更接近目标
    const currentHeight = item.originalHeight * scale;
    const nextHeight = item.originalHeight * (scale + 0.5);
    // 如果加 0.5 后高度仍小于目标，则可以放大（且不超过宽度上限）
    if (nextHeight < targetHeight && scale < 40) {
      const candidateWidth = item.originalWidth * (scale + 0.5);
      if (candidateWidth <= vw * item.maxWidthRatio) {
        scale += 0.5;
      }
    } else if (currentHeight > targetHeight && scale > 1) {
      // 当前高度已超过目标，可以考虑缩小
      scale -= 0.5;
    }

    // 4. 宽度上限约束（再次确认）
    if (item.maxWidthRatio) {
      const maxScale = Math.floor((vw * item.maxWidthRatio / item.originalWidth) * 2) / 2;
      if (maxScale < 1) maxScale = 1;
      scale = Math.min(scale, maxScale);
    }

    img.style.width = `${item.originalWidth * scale}px`;
  }


  // ***** 页面切换 *****

  function showPage(pageClass) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('page-active');
    });
    // 显示指定页面
    document.querySelector(`.${pageClass}`).classList.add('page-active');
  }

  //主页按钮切换
  document.getElementById('home-startButton').addEventListener('click', () => {
    showPage('question-page');
  });

  //调试用
showPage('home-page');
// showPage('question-page');
// showPage('result-page');

  // ***** 自动更新 *****

  //根据窗口大小调整所有像素图尺寸
  function updateAll() {
    items.forEach(updateImage);
  }
  //防止频繁更新，窗口变动>100ms时才更新
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateAll, 100);
  });

  updateAll();
})();