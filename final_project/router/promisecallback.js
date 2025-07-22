public_users.get('/title/:title', function (req, res) {
    const titleParam = req.params.title.toLowerCase();

    const booksByTitle = Object.values(books).filter((book) => {
        return book.title.toLowerCase() === titleParam;
    });


    let myPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (booksByTitle.length > 0) {
                resolve(booksByTitle);
            } else {
                reject("Book Title not found");
            }
        }, 6000);
    });
    console.log("Before calling promise");

    myPromise.then((foundTitle) => {
        return res.status(200).json({
            message: "Book found:",
            bookTitle: foundTitle
        });
    }).catch((err) => {
        return res.status(404).json({
            message: err
        });
    });

    console.log("After calling promise");
});