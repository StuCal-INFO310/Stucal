module.exports = {
    //allow module
    moduleFileExtensions: ['js', 'json', 'ts'],
    //allow all types for module
    moduleNameMapper: {
      '^@supabase/supabase-js$': '<rootDir>/node_modules/@supabase/supabase-js/dist/esm/index.js',
    },
  
    // Your Jest configuration options
    testEnvironment: 'node',
    testEnvironment: 'jsdom',
    // Add other configurations as needed
  };

