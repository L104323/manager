import request from '../utils/request';

export const fetchData = (query) => {
    return request({
        // url: './table.json',
        url: '/api/findGarbage',
        method: 'post',
        params: query
    });
};

export const deleteUser = (query) => {
    // console.log(id)
    return request({
        url: '/api/user/deleteUser',
        method: 'post',
        params: query
    })
}
export const findUser = () => {
    return request({
        url: '/api/user/login',
        method: 'post',
    })
}

