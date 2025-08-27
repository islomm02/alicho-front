// Simple test server to simulate your backend
const http = require('http');
const url = require('url');

const PORT = 8000;

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  

  if (path === '/api/tariffs' && req.method === 'GET') {
    // Mock tariff plans from database
    const tariffs = [
      {
        id: 1,
        name: 'basic',
        price: 199000,
        currency: 'UZS',
        features: [
          'messages_limit_10000',
          'leads_limit_1000', 
          'instagram_integration',
          'amocrm_integration',
          'telegram_integration',
          'task_automation',
          'ai_support_24_7',
          'multilingual_support',
          'analytics_panel'
        ]
      },
      {
        id: 2,
        name: 'standard',
        price: 399000,
        currency: 'UZS',
        features: [
          'messages_limit_30000',
          'leads_limit_3000',
          'instagram_integration', 
          'amocrm_integration',
          'telegram_integration',
          'task_automation',
          'ai_support_24_7',
          'multilingual_support',
          'analytics_panel',
          'priority_support',
          'unlimited_integrations'
        ]
      },
      {
        id: 3,
        name: 'premium',
        price: 599000,
        currency: 'UZS', 
        features: [
          'messages_limit_50000',
          'leads_limit_5000',
          'instagram_integration',
          'amocrm_integration', 
          'telegram_integration',
          'task_automation',
          'ai_support_24_7',
          'multilingual_support',
          'analytics_panel',
          'account_management',
          'advanced_analytics',
          'custom_ai_training'
        ]
      }
    ];
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      data: tariffs
    }));
    
  } else if (path === '/api/register' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        
        // Simulate registration
        if (data.email === 'test@existing.com') {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            error: 'Email allaqachon mavjud'
          }));
          return;
        }
        
        // Validate tariff_plan_id
        if (!data.tariff_plan_id || data.tariff_plan_id < 1 || data.tariff_plan_id > 3) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            error: 'Tariff rejasini tanlash majburiy (1, 2, yoki 3)'
          }));
          return;
        }
        
        // Validate password_confirmation
        if (!data.password_confirmation || data.password !== data.password_confirmation) {
          res.writeHead(422, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            errors: {
              password: ['The password field confirmation does not match.']
            }
          }));
          return;
        }
        
        // Success response
        const response = {
          success: true,
          message: "Muvaffaqiyatli ro'yxatdan o'tdingiz",
          user: {
            id: 'user_' + Math.random().toString(36).substr(2, 9),
            name: data.name,
            email: data.email,
            tariff_plan_id: data.tariff_plan_id
          },
          token: 'jwt_token_' + Math.random().toString(36).substr(2, 9)
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
        
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'Invalid JSON'
        }));
      }
    });
    
  } else if (path === '/api/ai-config' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        consolex.log('AI Config request:', data);
        
        // Check authorization
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            error: 'Authorization token kerak'
          }));
          return;
        }
        
        // Success response
        const response = {
          success: true,
          message: "AI sozlamalari muvaffaqiyatli saqlandi"
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
        
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'Invalid JSON'
        }));
      }
    });
    
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      error: 'Endpoint topilmadi'
    }));
  }
});

server.listen(PORT, () => {
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
  } else {
    console.error('Server error:', err);
  }
});