var app = angular.module('myApp', ["ngRoute"]);
app.controller('myCtrl', mainController);

app.config(function($routeProvider) {
    $routeProvider.when("/addBooks", {
        templateUrl : "pages/addBook.html",
		controller: addBookController
    }).when("/listBooks", {
        templateUrl : "pages/listBooks.html",
		controller: listBookController
    }).when("/favourites", {
        templateUrl : "pages/favourites.html",
		controller: favouritesController
    })
});

app.service("BookStoreService", function(){
	this.BookStore = {"books":[]};
	this.FavouriteList = [];
})

function mainController($scope, BookStoreService){
	BookStoreService.BookStore = JSON.parse(localStorage.BookStore);
	BookStoreService.FavouriteList = JSON.parse(localStorage.FavouriteList);
	$scope.bookCount = BookStoreService.BookStore.books.length;
	$scope.$on("onCountUpdate", function(){
		$scope.bookCount = BookStoreService.BookStore.books.length;
	})
	
	$scope.favouriteCount = BookStoreService.FavouriteList.length;
	$scope.$on("onFavouriteCountUpdate", function(){
		$scope.favouriteCount = BookStoreService.FavouriteList.length;
	})
}


function addBookController($scope, BookStoreService){
	
	$scope.BookName = "";
	$scope.AuthorName = "";
	$scope.BookPrice = "";
	
	$scope.addBook = function(){
		if($scope.BookName != "" && $scope.AuthorName != "" && $scope.BookPrice != "")
		{
			BookStoreService.BookStore = JSON.parse(localStorage.BookStore);
			BookStoreService.BookStore.books.push({name:$scope.BookName, author:$scope.AuthorName, price:$scope.BookPrice});
			$scope.BookName = "";
			$scope.AuthorName = "";
			$scope.BookPrice = "";
			localStorage.BookStore = JSON.stringify(BookStoreService.BookStore);
			$scope.$emit("onCountUpdate");
			alert("Book added successfully !!!");
		}
		else
			alert("Please fill all fields properly");
	}
}

function listBookController($scope, BookStoreService){
	$scope.listData = BookStoreService.BookStore.books;
	$scope.search = "";
	
	$scope.onRemoveBook = function(_index){
		$scope.listData.splice(_index, 1);
		BookStoreService.BookStore.books = $scope.listData;
		localStorage.BookStore = JSON.stringify(BookStoreService.BookStore);
		$scope.$emit("onCountUpdate");
	}
	
	$scope.onFavouriteClick = function(_book){
		
		var flag = true;
		for(var i in BookStoreService.FavouriteList)
		{
			if(BookStoreService.FavouriteList[i].name == _book.name)
				flag = false;
		}
		if(flag)
		{
			var deepCopy = {};
			angular.copy(_book, deepCopy);
			BookStoreService.FavouriteList.push(deepCopy);
			localStorage.FavouriteList = JSON.stringify(BookStoreService.FavouriteList);
			$scope.$emit("onFavouriteCountUpdate");
		}
	}
}

function favouritesController($scope, BookStoreService){
	
	$scope.search = "";
	
	$scope.FavouriteData = BookStoreService.FavouriteList;
	$scope.onFavouriteRemoveClick = function(_index){
		$scope.FavouriteData.splice(_index, 1);
		BookStoreService.FavouriteList = $scope.FavouriteData;
		localStorage.FavouriteList = JSON.stringify(BookStoreService.FavouriteList);
		$scope.$emit("onFavouriteCountUpdate");
	}
}