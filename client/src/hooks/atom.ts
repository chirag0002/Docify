import { atom } from 'recoil';

export const userAtom = atom({
    key: 'userAtom',
    default: {
        id:'',
        name:'',
        email:''
    }, 
});


export const documentAtom = atom({
    key: 'documentAtom',
    default: {
        title:'',
        content:'',
        userId:''
    }, 
});

interface User {
    id: number;
    email: string;
}

export const documentUsersAtom = atom<User[]>({
    key: 'documentUsersAtom',
    default: []
});