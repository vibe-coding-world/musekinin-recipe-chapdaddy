class MoodSection extends HTMLElement {
  constructor() {
    super();

    this.moods = [
      {
        href: 'list.html?mood=hearty',
        image: './assets/images/hamburg_hero.png',
        alt: 'ガッツリ食べたい日のハンバーグ',
        title: 'ガッツリ',
        note: '空腹時、外仕事後。',
      },
      {
        href: 'list.html?mood=light',
        image: './assets/images/uni_pasta_step_5_finish.png',
        alt: 'さっぱり食べたい日の仕上げ料理',
        title: 'さっぱり',
        note: '夜遅い時、食欲が薄い時。',
      },
      {
        href: 'list.html?mood=tired',
        image: './assets/images/oyakodon_bowl.png',
        alt: '疲れている日に食べたい親子丼',
        title: '疲れてる',
        note: 'やさしく栄養を入れる。',
      },
      {
        href: 'list.html?mood=drink',
        image: './assets/images/karaage_hero.png',
        alt: '酒を飲みたい日のからあげ',
        title: '酒飲みたい',
        note: '週末の晩酌のお供。',
      },
    ];
  }

  connectedCallback() {
    this.innerHTML = `
      <section class="la_section la_stack u_stack_20">
        <div class="c_heading c_heading--center">
          <img class="c_heading__icon c_heading__icon--chapdaddy" src="./assets/images/icon-chapdaddy.avif" alt="">
          <h2 class="text-hd-t02">気分で選ぶ</h2>
        </div>

        <div class="la_grid c_home-mood-grid">
          ${this.moods.map((mood) => `
            <a href="${mood.href}" class="c_home-mood">
              <img class="c_home-mood__image" src="${mood.image}" alt="${mood.alt}">
              <span class="c_home-mood__copy">
                <strong class="c_home-mood__title">${mood.title}</strong>
                <small class="c_home-mood__note">${mood.note}</small>
              </span>
            </a>
          `).join('')}
        </div>
      </section>
    `;
  }
}

customElements.define('mood-section', MoodSection);
