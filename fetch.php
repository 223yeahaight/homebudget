<?php
include 'connect.php';
$conn = openCon();

$sql = 'SELECT amount, freq, `type`, `date` FROM wydatki';

$result = $conn->query($sql);

if ($result->num_rows > 0)  
    { 
        // OUTPUT DATA OF EACH ROW 
        while($row = $result->fetch_assoc()) 
        { 
            echo 
                $row["amount"]. ";" . 
                $row["freq"]. ";" .  
                $row["type"]. ";".
                $row["date"]. ";";
        } 
    }  
    else { 
        echo "0 results"; 
    } 


closeCon($conn);
?>