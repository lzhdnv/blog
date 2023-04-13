<template>
  <div id="app" class="container">
    <br>
    <b-nav>
      <b-nav-item @click="book = null; searchMode=false">Все книги</b-nav-item>
      <b-nav-item @click="addBook">Найти книгу</b-nav-item>
    </b-nav>
    <hr>
    <div v-if="!searchMode">
    <h3 v-if="books.length>0">Все книги</h3>
    <b-table striped hover :items="books" @row-clicked="bookClick"></b-table>
  </div>
  <b-form @submit.prevent="postBook" v-if="book && searchMode">
      <b-form-input type="text" v-model="search" placeholder="Поиск"></b-form-input>
  <b-list-group v-if="search.length > 0">
      <b-list-item-group v-for="book in filteredBooks" :key = "book.idbook" > Название книги: {{ book.title }} Автор: {{ book.author }} Год выпуска: {{ book.year }} Количество книг: {{ book.count }}<br></b-list-item-group>
    </b-list-group>
    </b-form>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      searchMode: false, 
      books: [],
      book: null,
      search: ''
    }
  },
  computed:{  
      filteredBooks:function(){ 
        var self = this; 
        return this.books.filter(function(book){ 
          return book.title.toLowerCase().indexOf(self.search.toLowerCase()) !== -1 || book.author.toLowerCase().indexOf(self.search.toLowerCase())!== -1 || book.year.toLowerCase().indexOf(self.search.toLowerCase())!== -1;  
          }); 
      } 
 
    },
  methods: {
    getBooks() {
      this.axios.get("api/books").then((response) => {
          this.books = response.data
      })
    },
    postBook() {
      if(this.book.idbook > 0)
        this.axios.post("api/book", this.book).then(() => {
            this.searchMode = false
        }) 
      else 
        this.axios.put("api/books", this.book).then((response) => {
              this.searchMode = false
              this.book.idbook = response.data.insertId
              this.books.push(this.book)
          })    
    },
    bookClick(book) {
      this.book = book
      this.searchMode = false
    },
    addBook() {
      this.book = {
        idbook: 0,
        title: '',
        author: '',
        year: '',
        count: 0
      }
      this.searchMode = true
    }
  },
  created() {
    this.getBooks()
  }
}
</script>
