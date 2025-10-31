#!/bin/bash
# Run backend with H2 in-memory database for development and testing
# This will create test users automatically:
#   Admin:   admin@ges.com / admin123
#   Manager: manager@ges.com / manager123
#   Staff:   staff@ges.com / staff123

echo "🚀 Starting backend with H2 database..."
echo "📊 H2 Console will be available at: http://localhost:8080/h2-console"
echo "   JDBC URL: jdbc:h2:mem:gesdb"
echo "   Username: sa"
echo "   Password: (leave empty)"
echo ""
echo "🔐 Test users will be seeded automatically"
echo ""

./mvnw spring-boot:run -Dspring-boot.run.profiles=h2
