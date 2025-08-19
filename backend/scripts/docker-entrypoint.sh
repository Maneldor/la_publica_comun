#!/bin/sh
# ===================================
# LA PÚBLICA - DOCKER ENTRYPOINT SCRIPT
# ===================================

set -e

echo "🚀 Starting La Pública Backend..."

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
until npx prisma db ping > /dev/null 2>&1; do
  echo "⏳ Database not ready, waiting 2 seconds..."
  sleep 2
done

echo "✅ Database connection established"

# Run database migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy

# Seed database if in development and SEED_DATABASE is true
if [ "$NODE_ENV" = "development" ] && [ "$SEED_DATABASE" = "true" ]; then
  echo "🌱 Seeding database with initial data..."
  npm run db:seed || echo "⚠️  Seeding failed or already seeded"
fi

# Start the application
echo "🎯 Starting application server..."
exec "$@"