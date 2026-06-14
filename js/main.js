document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('slider');
  const steps = document.querySelectorAll('.progress-bar .step');
  
  if (slider && steps.length > 0) {
    slider.addEventListener('scroll', () => {
      // 現在のスクロール位置から表示中のインデックスを計算する
      const slideWidth = slider.clientWidth;
      const scrollLeft = slider.scrollLeft;
      const currentIndex = Math.round(scrollLeft / slideWidth);
      
      // プログレスバーのハイライトを更新する
      steps.forEach((step, index) => {
        if (index <= currentIndex) {
          step.classList.add('active');
        } else {
          step.classList.remove('active');
        }
      });
    });
  }
});
