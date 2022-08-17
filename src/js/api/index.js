const BASE_URL = 'http://localhost:3000/api';

const MenuApi = {
  async getAllMenuByCategory(category) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu`);
    return response.json();
  },
  async createMenu(category, name) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      console.error(`error :${response}`);
    }
  },
  async updateMenu(category, name, menuId) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu/${menuId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) console.error('에러발생');
    return response.json();
  },
  async toggleSoldOutMenu(category, menuId) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu/${menuId}/soldout`, {
      method: 'PUT',
    });
    if (!response.ok) console.error('에러발생');
  },
  async deleteMenu(category, menuId) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu/${menuId}`, {
      method: 'DELETE',
    });
    if (!response.ok) console.error('에러발생');
  },
};

export default MenuApi;
