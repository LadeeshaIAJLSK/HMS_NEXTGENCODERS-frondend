const BASE_URL = "http://localhost:5003/categories";

export const fetchCategories = async () => {
  const res = await fetch(BASE_URL);
  return res.json();
};

export const addCategory = async (name) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return res.json();
};

export const updateCategory = async (id, name) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return res.json();
};

export const deleteCategory = async (id) => {
  await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
};
