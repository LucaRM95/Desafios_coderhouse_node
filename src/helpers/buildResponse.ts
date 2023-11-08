import { ProductModel } from "../interfaces/ProductModel";

const buildResponse = ( data: any ) => {
    return {
        status: 'success',
        payload: data?.docs.map( ( products: ProductModel ) => products),
        totalPages: data?.totalPages,
        prevPage: data?.prevPage,
        nextPage: data?.nextPage,
        page: data?.page,
        hasPrevPage: data?.hasPrevPage,
        hasNextPage: data?.hasNextPage,
        prevLink: data?.hasPrevPage ? `http://localhost:8080/api/products?limit=${data?.limit}&page=${data?.prevPage}` : null,
        nextLink: data?.hasNextPage ? `http://localhost:8080/api/products?limit=${data?.limit}&page=${data?.nextPage}` : null
    }
}

export default buildResponse;