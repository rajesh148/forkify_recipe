export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id,title,author,img) {
        const like = {id,title,author,img};
        this.likes.push(like);
        //Persists the data
        this.persistData();
        return like;

    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index,1);
        //persists the data
        this.persistData();
    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumOfLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes',JSON.stringify(this.likes));
    }

    readFromStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));

        //Restore the likes form local storage;
        if(storage) this.likes = storage;
    }
}