# Clean up

rm -rf lambda-deployment lambda-deployment.zip

# Create fresh deployment

mkdir lambda-deployment
cd lambda-deployment

# Copy lambda.js to root

cp ../lambda.js ./

# Copy the entire src folder structure

cp -r ../src/ ./src/

# Copy package.json

cp ../package.json ./

# Install dependencies

npm install --production

# Create zip

zip -r ../lambda-deployment.zip . -x "_.md" ".git/_" ".env*" "node_modules/.cache/*"
