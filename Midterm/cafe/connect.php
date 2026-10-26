<?php

$conn = mysqli_connect(
    "localhost",
    "root",
    "abcde12345",
    "cafe_db"
);

if (!$conn) {
    die("Connection Failed");
}

?>