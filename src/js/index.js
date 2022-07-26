// step1 요구사항 구현을 위한 전략
// TODO 메뉴 추가
//   - [x] 메뉴의 이름을 입력 받고 엔터키 입력이나 확인버튼으로 메뉴 추가
//	 - [x] 추가되는 메뉴의 아래 마크업은 `<ul id="menu-list" class="mt-3 pl-0"></ul>` 안에 삽입해야 한다.
//   - [x] 총 메뉴 갯수를 count하여 상단에 보여준다.
//   - [x] 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
//   - [x] 사용자 입력값이 빈 값이라면 추가되지 않는다.

// TODO 메뉴 수정
// - [x] 메뉴의 수정 버튼을 눌러 메뉴 이름 수정할 수 있다.
//   - [x] 메뉴 수정시 브라우저에서 제공하는 `prompt` 인터페이스를 활용한다.

// TODO 메뉴 삭제
// - [x] 메뉴 삭제 버튼을 이용하여 메뉴 삭제할 수 있다.
//   - [x] 메뉴 삭제시 브라우저에서 제공하는 `confirm` 인터페이스를 활용한다.
// - [x] 총 메뉴개수 업데이트
//

//  step2 요구사항 - 상태 관리로 메뉴 관리하기

// localStorage Read & Write
// - [x] [localStorage]에 데이터를 저장
//  - [x] 메뉴 추가
//  - [x] 메뉴 수정
//  - [x] 메뉴 삭제
// - [x] 새로고침 시 localStorage 에서 데이터 읽어온다

// 카테고리별 메뉴판 관리
// - [x] 에스프레소
// - [x] 프라푸치노
// - [x] 블렌디드
// - [x] 티바나
// - [x] 디저트

// 페이지 접근시 최초 데이터 Read & Randering
//   - [x] localStorage 에서 데이터를 불러와서 페이지에 최초로 접근할 때는 에스프레소 메뉴가 먼저 보이게 한다.
// - [x]  에스프레소 메뉴를 페이지에 그려준다

// 품절
// - [x] 품절 버튼을 추가
// - [x] 버튼 클릭시 localStorage 에 상태값 저장
// - [x] sold-out class 를 추가하여 상태변경

// step3 요구사항 - 서버와의 통신을 통해 메뉴 관리하기
// - [ ] 웹 서버를 띄운다.
// - [ ] 서버에 새로운 메뉴가 추가될 수 있도록 요청한다.
// - [ ] 서버에 카테고리별 메뉴리스트를 불러온다
// - [ ] 서버에 메뉴가 수정 될 수 있도록 요청한다.
// - [ ] 서버에 메뉴가 삭제 될 수 있도록 요청한다.
// - [ ] 
 
// 링크에 있는 웹 서버 저장소를 clone하여 로컬에서 웹 서버를 실행시킨다.
// 웹 서버를 띄워서 실제 서버에 데이터의 변경을 저장하는 형태로 리팩터링한다.
// localStorage에 저장하는 로직은 지운다.
// fetch 비동기 api를 사용하는 부분을 async await을 사용하여 구현한다.
// API 통신이 실패하는 경우에 대해 사용자가 알 수 있게 alert으로 예외처리를 진행한다.
// 중복되는 메뉴는 추가할 수 없다.

import $ from './utils/dom.js';
import store from './store/index.js'

const BASE_URL = "http://localhost:3000/api"

function App() {
  // 상태 : 변할 수 있는 데이터 (여기서는 메뉴명) 갯수는 굳이 관리할필요 없음
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  this.currentCategory = 'espresso';

  this.init = () => {
    if (store.getLocalStorage()) {
      this.menu = store.getLocalStorage();
    }
    rander();
    initEventListeners();
  };

  const rander = () => {
    const templete = this.menu[this.currentCategory]
      .map((menuItem, index) => {
        return `
    <li data-menu-id = "${index}" class="menu-list-item d-flex items-center py-2">
    <span class="w-100 pl-2 menu-name ${menuItem.soldOut ? 'sold-out' : ""}">${menuItem.name}</span>
    <button type="button" class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button">
      품절
    </button>
    <button
      type="button"
      class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
    >
      수정
    </button>
    <button
      type="button"
      class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
    >
      삭제
    </button>
  </li>`;
      })
      .join('');

    $('#menu-list').innerHTML = templete;
    updateMenuCount();
  };

  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $('.menu-count').innerText = `총 ${menuCount}개`;
  };

  const addMenuName = async() => {
    if ($('#menu-name').value == '') {
      alert('blank');
      return;
    }   
    const menuName = $('#menu-name').value;

    fetch(`${BASE_URL}/category/${this.currentCategory}/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name: menuName}),
    }).then(response =>{
      return response.json();
    }).then(data => {
      console.log(data);
    });

    await fetch(`${BASE_URL}/category/${this.currentCategory}/menu`)
      .then(response =>{
        return response.json();
      }).then(data => {
        console.log(data);
        this.menu[this.currentCategory] = data;
        rander();
        $('#menu-name').value = '';
      });
  }

  const updateMenuName = e => {
    const menuId = e.target.closest('li').dataset.menuId;
    const $menuName = e.target.closest('li').querySelector('.menu-name');
    const updatedMenuName = prompt('메뉴명을 입력하세요', $menuName.innerText);
    this.menu[this.currentCategory][menuId].name = updatedMenuName;
    store.setLocalStorage(this.menu);
    rander();
  };

  const removeMenuName = e => {
    if (confirm('정말 삭제하시겠습니까?')) {
      const menuId = e.target.closest('li').dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1);
      store.setLocalStorage(this.menu);
      rander();
    }
  };

  const soldOutMenuName = e => {
    const menuId = e.target.closest('li').dataset.menuId;
    this.menu[this.currentCategory][menuId].soldOut = !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage(this.menu);
    rander();
  };

  const initEventListeners = () =>{
    $('#menu-list').addEventListener('click', e => {
      if (e.target.classList.contains('menu-edit-button')) {
        updateMenuName(e);
        return;
      }
      if (e.target.classList.contains('menu-remove-button')) {
        removeMenuName(e);
        return;
      }
      if (e.target.classList.contains('menu-sold-out-button')) {
        soldOutMenuName(e);
        return;
      }
    });
  
    $('#menu-form').addEventListener('submit', e => {
      e.preventDefault();
    });
  
    $('#menu-submit-button').addEventListener('click', addMenuName);
  
    $('#menu-name').addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        addMenuName();
      }
    });
  
    $('nav').addEventListener('click', e => {
      const isCategoryButton = e.target.classList.contains('cafe-category-name');
      if (isCategoryButton) {
        const categoryName = e.target.dataset.categoryName;
        this.currentCategory = categoryName;
        $('#category-title').innerText = `${e.target.innerText} 메뉴 관리`;
        rander();
      }
    })
  };  
}

const app = new App();
app.init();
