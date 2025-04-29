<?php
// read_ingredients
require '../db.php';

$stmt = $pdo->query("SELECT * FROM Ingredient WHERE ");
$ingredients = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($ingredients);
?>