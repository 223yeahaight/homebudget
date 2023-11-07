<?php
include 'connect.php';
$conn = openCon();
$title = $_POST['title'];
$amount = $_POST['amount'];
$freq = $_POST['freq'];
$type = $_POST['type'];
$date = $_POST['date'];

$sql = "INSERT INTO wydatki (title, amount, freq, `type`, `date`) VALUES ('$title', '$amount', '$freq', '$type', '$date')";

$result = $conn->query($sql);

closeCon($conn);

?>