import axios from "axios";
import { API_URL, mock } from "./utils";

describe("API Tests", () => {
  beforeEach(async () => {
    const response = await axios.delete(`${API_URL}/todos`);
    expect(response.status).toBe(200);
  });

  it("should create a new todo via the API and then fetch it", async () => {
    const createResponse = await axios.post(`${API_URL}/todo`, mock[0]);
    expect(createResponse.status).toBe(200);

    const todoId = createResponse.data.id;
    const fetchResponse = await axios.get(`${API_URL}/todo/${todoId}`);
    expect(fetchResponse.status).toBe(200);
    expect(fetchResponse.data).toEqual({ ...mock[0], id: todoId });
  });

  it("should create new todos via the API", async () => {
    const response = await axios.post(`${API_URL}/todos`, mock);
    expect(response.status).toBe(200);
  });

  it("should fetch data from the API", async () => {
    const response = await axios.get(`${API_URL}/todos`);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(mock);
  });

  it("should update a todo via the API", async () => {
    const createResponse = await axios.post(`${API_URL}/todo`, mock[0]);
    expect(createResponse.status).toBe(200);
    const todoId = createResponse.data.id;
    const updatedTodo = {
      ...mock[0],
      id: todoId,
      task: "Updated task",
      completed: true,
    };
    const response = await axios.put(`${API_URL}/todo/${todoId}`, updatedTodo);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(updatedTodo);
  });

  it("should delete a todo via the API", async () => {
    const createResponse = await axios.post(`${API_URL}/todo`, mock[0]);
    expect(createResponse.status).toBe(200);
    const todoId = createResponse.data.id;
    const response = await axios.delete(`${API_URL}/todo/${todoId}`);
    expect(response.status).toBe(200);
    const fetchResponse = await axios.get(`${API_URL}/todo/${todoId}`);
    expect(fetchResponse.status).toBe(404);
  });
});
