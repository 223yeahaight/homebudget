<?php
function openCon(){
  $servername = "localhost";
  $username = "root";
  $password = "";
  $dbname = "wydatki";

  $conn = new mysqli($servername, $username, $password, $dbname);
  
  if ($conn -> connect_errno) {
    echo "Failed to connect to MySQL: " . $conn -> connect_error;
    exit();
  }
  return $conn;

}

function closeCon($conn){
  $conn -> close();  
}

$conn = openCon();
closeCon($conn);  

?>
