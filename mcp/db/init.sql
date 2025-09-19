-- Create todos table (SQLite doesn't support ENUMs, but we'll validate in application layer)
CREATE TABLE IF NOT EXISTS todos (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('ab89',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Incomplete' CHECK (status IN ('Incomplete', 'In Progress', 'Complete')),
    category TEXT NOT NULL CHECK (category IN (
        'Customer Acquisition',
        'Operational Efficiency', 
        'Product Manufacturing',
        'System Management',
        'Financial Optimization',
        'Product Servicing & Repairs'
    )),
    priority_rating TEXT NOT NULL CHECK (priority_rating IN ('Low', 'Medium', 'High')),
    optimal_weather_conditions TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_todos_updated_at
    AFTER UPDATE ON todos
    FOR EACH ROW
    BEGIN
        UPDATE todos SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END

