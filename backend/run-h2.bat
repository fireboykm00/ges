@echo off
REM Run backend with H2 in-memory database for development and testing
REM This will create test users automatically:
REM   Admin:   admin@ges.com / admin123
REM   Manager: manager@ges.com / manager123
REM   Staff:   staff@ges.com / staff123

echo.
echo Starting backend with H2 database...
echo H2 Console will be available at: http://localhost:8080/h2-console
echo    JDBC URL: jdbc:h2:mem:gesdb
echo    Username: sa
echo    Password: (leave empty)
echo.
echo Test users will be seeded automatically
echo.

mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=h2
