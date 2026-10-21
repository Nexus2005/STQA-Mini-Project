<?php
/**
 * COVID-19 Portal - Supabase Table Initialization & Seeder
 * STQA Mini Project
 */

require_once __DIR__ . '/../config/database.php';

echo "========================================================\n";
echo "  COVID-19 Portal: Supabase Database Migration Tool    \n";
echo "========================================================\n\n";

try {
    $pdo = getDBConnection();
    echo "[+] Successfully connected to database engine: " . $pdo->getAttribute(PDO::ATTR_DRIVER_NAME) . "\n";
    
    $schemaFile = __DIR__ . '/schema.sql';
    if (!file_exists($schemaFile)) {
        throw new Exception("Schema file not found at: {$schemaFile}");
    }
    
    $sql = file_get_contents($schemaFile);
    echo "[+] Reading schema.sql (" . strlen($sql) . " bytes)...\n";
    
    // Execute SQL script
    $pdo->exec($sql);
    echo "[SUCCESS] All tables created and seed data inserted successfully into Supabase!\n\n";
    
    // Verify tables
    $stmtUsers = $pdo->query("SELECT count(*) FROM users");
    $stmtComments = $pdo->query("SELECT count(*) FROM comments");
    $stmtFeedback = $pdo->query("SELECT count(*) FROM feedback");
    
    echo "--- Verification Counts ---\n";
    echo "Users count:    " . $stmtUsers->fetchColumn() . "\n";
    echo "Comments count: " . $stmtComments->fetchColumn() . "\n";
    echo "Feedback count: " . $stmtFeedback->fetchColumn() . "\n";
    echo "---------------------------\n";
    echo "Supabase Database is ready for live operations!\n";

} catch (Exception $e) {
    echo "\n[ERROR] Database Migration Failed: " . $e->getMessage() . "\n";
    exit(1);
}
