import axios from "axios";

export const httpClient = axios.create({
  baseURL: "https://apisoft.softeletronica.com.br",
});
