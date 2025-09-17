#!/bin/bash

echo "🚀 Setting up Audit Man-Day Calculator..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    echo 'DATABASE_URL="file:./dev.db"' > .env
    echo 'NEXTAUTH_SECRET="your-secret-key-here"' >> .env
    echo 'NEXTAUTH_URL="http://localhost:3000"' >> .env
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Push schema to database
echo "🗄️ Setting up database..."
npm run db:push

# Seed database
echo "🌱 Seeding database..."
npm run db:seed

echo "✅ Setup complete!"
echo ""
echo "🎉 Your audit calculator is ready!"
echo "Run 'npm run dev' to start the development server"
echo "Then open http://localhost:3000 in your browser"
