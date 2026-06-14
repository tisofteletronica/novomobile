export interface ModelsIdResponse {
  id: string;
  name: string;
}

export interface YearsResponse {
  id: string;
  ano: number;
}

export interface SearchResponse {
  content: {
    categoriaId: string;
    name: string;
    modeloId: string;
    modelo: string;
    ano: string;
    imgUrl: string;
  }[];
}

// 1. Para a busca inicial de modelos por montadora
export interface ModelsIdResponse {
  id: string;
  name: string;
}

// 2. Para a listagem de anos disponíveis de um modelo
export interface YearsResponse {
  id: string;
  ano: number;
}

// 3. Para as categorias (Alarmes, Vidros, etc) que aparecem após selecionar modelo/ano
export interface SearchResponse {
  content: {
    categoriaId: string;
    name: string;
    modeloId: string;
    modelo: string;
    ano: string;
    imgUrl: string;
  }[];
}

export interface ProductsByModelAndCategoryResponse {
  content: {
    id: string;
    modeloInstalesoftId: string;
    nameMontadoraInstaleSoft: string;
    nameModeloInstaleSoft: string;
    ano: string;
    categoryInstaleSoftName: string;
    productId: string;
    productName: string;
    codigo: string;
    descricaoInstaleSoft: string;
    urlManual: string;
    urlVideo: string;
    urlEsquema: string;
    imgUrl1: string;
    imgUrl2: string;
    imgUrl3: string;
    imgUrl4: string;
    imgUrl5: string;
  }[];
  size: number;
  totalPages: number;
  totalElements: number;
}

export interface ProductsByIdResponse {
  id: string;
  code: string;
  name: string;
  descriptionCommercialResume: string;
  descriptionCommercial: string;
  descriptionCharacteristicsCommercial: string;
  applicationCommercial: string;
  epilogueCommercial: string;
  descriptionInstalesoft: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  capaImagem: string;
  imgUrl1: string;
  imgUrl2: string;
  imgUrl3: string;
  imgUrl4: string;
  imgUrl5: string;
  urlManual: string;
  zip: string;
  categoryCommercialId: string;
  nameCategoryCommercial: string;
}

export interface CategoriesResponse {
  content: {
    id: string;
    name: string;
    imgUrl: string;
  }[];
}

export interface ProductsByCategoryIdResponse {
  content: {
    id: string;
    code: string;
    name: string;
    descriptionCommercialResume: string;
    descriptionCommercial: string;
    descriptionCharacteristicsCommercial: string;
    applicationCommercial: string;
    epilogueCommercial: string;
    descriptionInstalesoft: string;
    weight: string;
    length: string;
    width: string;
    height: string;
    capaImagem: string;
    imgUrl1: string;
    imgUrl2: string;
    imgUrl3: string;
    imgUrl4: string;
    imgUrl5: string;
    urlManual: string;
    categoryCommercialId: string;
    nameCategoryCommercial: string;
  }[];
  size: number;
  totalPages: number;
  totalElements: number;
}

export interface ProductsUniqueByAutomakerResponse {
  id: string;
  code: string;
  name: string;
  descriptionCommercialResume: string;
  descriptionCommercial: string;
  descriptionCharacteristicsCommercial: string;
  applicationCommercial: string;
  epilogueCommercial: string;
  descriptionInstalesoft: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  capaImagem: string;
  imgUrl1: string;
  imgUrl2: string;
  imgUrl3: string;
  imgUrl4: string;
  imgUrl5: string;
  urlManual: string;
  categoryCommercialId: string;
  nameCategoryCommercial: string;
}

export interface ProductsUniqueByAutomakerResponse {
  id: string;
  code: string;
  name: string;
  descriptionCommercialResume: string;
  descriptionCommercial: string;
  descriptionCharacteristicsCommercial: string;
  applicationCommercial: string;
  epilogueCommercial: string;
  descriptionInstalesoft: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  capaImagem: string;
  imgUrl1: string;
  imgUrl2: string;
  imgUrl3: string;
  imgUrl4: string;
  imgUrl5: string;
  urlManual: string;
  categoryCommercialId: string;
  nameCategoryCommercial: string;
}

export interface ProductsUniqueByAutomakerResponse {
  id: string;
  code: string;
  name: string;
  descriptionCommercialResume: string;
  descriptionCommercial: string;
  descriptionCharacteristicsCommercial: string;
  applicationCommercial: string;
  epilogueCommercial: string;
  descriptionInstalesoft: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  capaImagem: string;
  imgUrl1: string;
  imgUrl2: string;
  imgUrl3: string;
  imgUrl4: string;
  imgUrl5: string;
  urlManual: string;
  categoryCommercialId: string;
  nameCategoryCommercial: string;
}
