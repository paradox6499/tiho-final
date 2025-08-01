import React, { useState, useEffect } from 'react';

const TihoTelegramBot = () => {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [isLoading, setIsLoading] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [purchaseStep, setPurchaseStep] = useState(1);
  const [coopStep, setCoopStep] = useState(1);
  const [coopType, setCoopType] = useState('');
  const [purchaseData, setPurchaseData] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextScreen, setNextScreen] = useState(null);

  useEffect(() => {
    // Telegram Web App инициализация
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      
      // Настройка темы
      tg.setHeaderColor('#CB5B40');
      tg.setBackgroundColor('#f3f4f6');
      
      // Показать кнопку "Назад" когда не на главном экране
      if (currentScreen !== 'welcome') {
        tg.BackButton.show();
        tg.BackButton.onClick(() => {
          resetChat();
        });
      } else {
        tg.BackButton.hide();
      }
    }

    // Загрузка EmailJS
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.onload = () => {
      window.emailjs.init('YOUR_PUBLIC_KEY'); // Замените на ваш реальный ключ
    };
    document.head.appendChild(script);

    // Имитация загрузки приложения
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentScreen]);

  const resetChat = () => {
    setIsTransitioning(true);
    setNextScreen('welcome');
    setTimeout(() => {
      setCurrentScreen('welcome');
      setPurchaseStep(1);
      setCoopStep(1);
      setCoopType('');
      setPurchaseData({});
      setUserInput('');
      setIsTransitioning(false);
      setNextScreen(null);
    }, 150);
  };

  const handleMainAction = (action) => {
    setIsTransitioning(true);
    setNextScreen(action);
    setTimeout(() => {
      setCurrentScreen(action);
      setIsTransitioning(false);
      setNextScreen(null);
    }, 150);
  };

  const handleStepChange = (callback) => {
    setIsTransitioning(true);
    setTimeout(() => {
      callback();
      setIsTransitioning(false);
    }, 150);
  };

  // Функция отправки email через EmailJS
  const sendEmailNotification = async (data) => {
    try {
      const templateParams = {
        work_link: data.workLink || 'Не указано',
        payment_method: data.paymentMethod || 'Не указано',
        delivery: data.delivery ? 'Да' : 'Нет',
        client_info: data.deliveryInfo || data.pickupInfo || 'Не указано',
        to_email: 'rikatihonenko@gmail.com' // Email для получения заявок
      };

      await window.emailjs.send(
        'YOUR_SERVICE_ID', // Замените на реальный Service ID
        'YOUR_TEMPLATE_ID', // Замените на реальный Template ID
        templateParams
      );
      
      console.log('Email отправлен успешно');
    } catch (error) {
      console.error('Ошибка отправки email:', error);
    }
  };

  const renderWelcome = () => (
    <div className="space-y-4 animate-fade-in">
      <div style={{backgroundColor: '#CB5B40'}} className="text-white p-4 rounded-lg animate-bounce-in">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden p-1">
            <img 
              src="/logo.jpg" 
              alt="ТИХО Gallery" 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.outerHTML = '<div className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-sm" style="background-color: #CB5B40;">Т</div>';
              }}
            />
          </div>
          <div>
            <p className="font-medium">Добро пожаловать в ТИХО!</p>
            <p className="text-sm opacity-90">Будем рады ответить на все ваши вопросы. Подскажите, что вас интересует?</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <button 
          onClick={() => handleMainAction('purchase')}
          className="w-full bg-white p-3 rounded-lg text-left transition-smooth hover-lift button-press animate-slide-in-right"
          style={{border: '1px solid #CB5B40', animationDelay: '0.1s'}}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#CB5B4010'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
        >
          📖 Приобрести работу
        </button>
        <button 
          onClick={() => handleMainAction('cooperation')}
          className="w-full bg-white p-3 rounded-lg text-left transition-smooth hover-lift button-press animate-slide-in-right"
          style={{border: '1px solid #CB5B40', animationDelay: '0.2s'}}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#CB5B4010'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
        >
          🤝 Уточнить условия сотрудничества
        </button>
        <button 
          onClick={() => handleMainAction('review')}
          className="w-full bg-white p-3 rounded-lg text-left transition-smooth hover-lift button-press animate-slide-in-right"
          style={{border: '1px solid #CB5B40', animationDelay: '0.3s'}}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#CB5B4010'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
        >
          ⭐ Оставить отзыв
        </button>
        <button 
          onClick={() => handleMainAction('social')}
          className="w-full bg-white p-3 rounded-lg text-left transition-smooth hover-lift button-press animate-slide-in-right"
          style={{border: '1px solid #CB5B40', animationDelay: '0.4s'}}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#CB5B4010'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
        >
          📱 Соцсети
        </button>
        <button 
          onClick={() => handleMainAction('events')}
          className="w-full bg-white p-3 rounded-lg text-left transition-smooth hover-lift button-press animate-slide-in-right"
          style={{border: '1px solid #CB5B40', animationDelay: '0.5s'}}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#CB5B4010'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
        >
          📅 Афиша мероприятий
        </button>
      </div>
    </div>
  );

  const renderPurchase = () => {
    if (purchaseStep === 1) {
      return (
        <div className="space-y-4 animate-fade-in">
          <div style={{backgroundColor: '#CB5B40'}} className="text-white p-4 rounded-lg">
            <p>Отлично! Подскажите, какая работа вас интересует?</p>
            <p className="text-sm mt-2">Вы можете:</p>
            <p className="text-xs mt-1">• Указать название работы или имя художника</p>
            <p className="text-xs">• Описать интересующую вас работу</p>
            <p className="text-xs">• Или вставить ссылку с нашего сайта</p>
            <a 
              href="https://tihogallery.ru/art" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline text-sm block mt-2"
            >
              📖 Открыть каталог работ
            </a>
          </div>
          <div className="flex space-x-2">
            <input 
              type="text" 
              placeholder="Название работы, художник или ссылка..."
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#CB5B40'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
            <button 
              onClick={() => {
                if (userInput.trim()) {
                  handleStepChange(() => {
                    setPurchaseData({...purchaseData, workLink: userInput});
                    setUserInput('');
                    setPurchaseStep(2);
                  });
                }
              }}
              className="px-4 py-3 text-white rounded-lg disabled:opacity-50 transition-colors"
              style={{backgroundColor: '#CB5B40'}}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#A04932'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#CB5B40'}
              disabled={!userInput.trim()}
            >
              →
            </button>
          </div>
        </div>
      );
    }

    if (purchaseStep === 2) {
      return (
        <div className="space-y-4">
          <div style={{backgroundColor: '#CB5B40'}} className="text-white p-4 rounded-lg">
            <p>Подскажите, как вам было бы удобно оплатить покупку?</p>
          </div>
          <div className="space-y-2">
            {['по ссылке', 'по QR', 'по счету', 'наличными при самовывозе'].map(option => (
              <button 
                key={option}
                onClick={() => {
                  handleStepChange(() => {
                    setPurchaseData({...purchaseData, paymentMethod: option});
                    setPurchaseStep(3);
                  });
                }}
                className="w-full bg-white p-3 rounded-lg text-left transition-colors"
                style={{border: '1px solid #CB5B40'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#CB5B4010'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (purchaseStep === 3) {
      return (
        <div className="space-y-4">
          <div style={{backgroundColor: '#CB5B40'}} className="text-white p-4 rounded-lg">
            <p>Спасибо! Подскажите, вам понадобится доставка?</p>
          </div>
          <div className="space-y-2">
            <button 
              onClick={() => {
                handleStepChange(() => {
                  setPurchaseData({...purchaseData, delivery: true});
                  setPurchaseStep(4);
                });
              }}
              className="w-full bg-white p-3 rounded-lg text-left transition-colors"
              style={{border: '1px solid #CB5B40'}}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#CB5B4010'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
            >
              Да
            </button>
            <button 
              onClick={() => {
                handleStepChange(() => {
                  setPurchaseData({...purchaseData, delivery: false});
                  setPurchaseStep(5);
                });
              }}
              className="w-full bg-white p-3 rounded-lg text-left transition-colors"
              style={{border: '1px solid #CB5B40'}}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#CB5B4010'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
            >
              Нет
            </button>
          </div>
        </div>
      );
    }

    if (purchaseStep === 4) {
      return (
        <div className="space-y-4">
          <div style={{backgroundColor: '#CB5B40'}} className="text-white text-sm p-4 rounded-lg">
            <p>Отлично! Введите, пожалуйста, ваши ФИО и контактный номер телефона, реквизиты при оплате от юр.лиц, полный адрес доставки, а также контакты получателя. Все данные конфиденциальны и не подлежат передаче третьим лицам.</p>
            <p className="text-xs mt-2 opacity-90">Обращаем внимание, что доставка оплачивается отдельно. После расчета стоимости наш менеджер свяжется с вами для уточнения деталей.</p>
          </div>
          <textarea 
            placeholder="Введите все необходимые данные..."
            className="w-full p-3 border rounded-lg h-32 focus:outline-none focus:ring-2"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = '#CB5B40'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
          <button 
            onClick={() => {
              if (userInput.trim()) {
                const finalData = {...purchaseData, deliveryInfo: userInput};
                setPurchaseData(finalData);
                sendEmailNotification(finalData);
                setUserInput('');
                setPurchaseStep(6);
              }
            }}
            className="w-full px-4 py-3 text-white rounded-lg disabled:opacity-50 transition-colors"
            style={{backgroundColor: '#CB5B40'}}
            onMouseEnter={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#A04932')}
            onMouseLeave={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#CB5B40')}
            disabled={!userInput.trim()}
          >
            Отправить
          </button>
        </div>
      );
    }

    if (purchaseStep === 5) {
      return (
        <div className="space-y-4">
          <div style={{backgroundColor: '#CB5B40'}} className="text-white text-sm p-4 rounded-lg">
            <p>Отлично! Забрать работу самостоятельно можно из пространства галереи по адресу г. Москва, Малый Харитоньевский переулок, д. 6с2 со вторника по субботу с 12:00 до 20:00.</p>
            <p className="text-xs mt-2 opacity-90">Просим заранее предупредить о своем визите как минимум за день, чтобы наша команда успела подготовить все документы и работу к выдаче. Заранее спасибо!</p>
            <p className="text-xs mt-2 opacity-90">Также укажите, пожалуйста, ваши ФИО и контактный номер телефона / реквизиты при оплате от юр.лиц. Все данные конфиденциальны и не подлежат передаче третьим лицам.</p>
          </div>
          <textarea 
            placeholder="Введите ваши данные..."
            className="w-full p-3 border rounded-lg h-24 focus:outline-none focus:ring-2"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = '#CB5B40'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
          <button 
            onClick={() => {
              if (userInput.trim()) {
                const finalData = {...purchaseData, pickupInfo: userInput};
                setPurchaseData(finalData);
                sendEmailNotification(finalData);
                setUserInput('');
                setPurchaseStep(6);
              }
            }}
            className="w-full px-4 py-3 text-white rounded-lg disabled:opacity-50 transition-colors"
            style={{backgroundColor: '#CB5B40'}}
            onMouseEnter={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#A04932')}
            onMouseLeave={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#CB5B40')}
            disabled={!userInput.trim()}
          >
            Отправить
          </button>
        </div>
      );
    }

    if (purchaseStep === 6) {
      return (
        <div className="space-y-4">
          <div style={{backgroundColor: '#CB5B40'}} className="text-white p-4 rounded-lg">
            <p className="text-sm">Спасибо! Ваша заявка отправлена менеджеру. Пока наши менеджеры обрабатывают запрос, вы можете ознакомиться с договором-офертой по данной ссылке:</p>
            <a 
              href="https://tihogallery.ru/faq#rec790264355" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline text-sm"
            >
              📄 Договор-оферта
            </a>
            <p className="mt-2 text-sm">Мы вернемся с ответом в ближайшие пару часов!</p>
          </div>
          <button 
            onClick={resetChat}
            className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Вернуться в главное меню
          </button>
        </div>
      );
    }
  };

  const renderCooperation = () => {
    if (coopStep === 1) {
      return (
        <div className="space-y-4">
          <div style={{backgroundColor: '#CB5B40'}} className="text-white p-4 rounded-lg">
            <p>Подскажите, какое сотрудничество вас интересует?</p>
          </div>
          <div className="space-y-2">
            {['я художник', 'я дизайнер', 'аренда помещения', 'другое'].map(option => (
              <button 
                key={option}
                onClick={() => {
                  setCoopType(option);
                  setCoopStep(2);
                }}
                className="w-full bg-white p-3 rounded-lg text-left transition-colors"
                style={{border: '1px solid #CB5B40'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#CB5B4010'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (coopStep === 2) {
      if (coopType === 'я художник') {
        return (
          <div className="space-y-4">
            <div style={{backgroundColor: '#CB5B40'}} className="text-white text-sm p-4 rounded-lg">
              <p>Отлично! Если вы хотите стать художником нашей галереи, вам необходимо прислать ваше портфолио в формате PDF (не больше 25мб) с указанием названия и цены работ, а также полное актуальное CV в формате PDF на нашу почту info@tihogallery.ru.</p>
              <p className="text-xs mt-2 opacity-90">В теме письма необходимо указать «новый художник ТИХО». В противном случае ваше письмо просто потеряется.</p>
            </div>
            <button 
              onClick={() => setCoopStep(3)}
              className="w-full px-4 py-3 text-white rounded-lg transition-colors"
              style={{backgroundColor: '#CB5B40'}}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#A04932'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#CB5B40'}
            >
              Понятно, спасибо!
            </button>
          </div>
        );
      }

      if (coopType === 'я дизайнер') {
        return (
          <div className="space-y-4">
            <div style={{backgroundColor: '#CB5B40'}} className="text-white text-sm p-4 rounded-lg">
              <p>Отлично! Мы сотрудничаем с дизайнерами, декораторами и архитекторами. Вы можете взять наши работы на съёмку или примерку. Для аренды на съёмку вам необходимо будет оплатить транспортные расходы из галереи и обратно, а также указать галерею при публикации и любом использовании изображений произведений искусства.</p>
              <p className="text-xs mt-2 opacity-90">Опишите, пожалуйста, что вас интересует? Укажите желаемые даты и время съёмки/примерки, а также по возможности пришлите ссылки на интересующие вас работы с нашего сайта https://tihogallery.ru/art</p>
            </div>
            <textarea 
              placeholder="Опишите ваш запрос..."
              className="w-full p-3 border rounded-lg h-32 focus:outline-none focus:ring-2"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#CB5B40'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
            <button 
              onClick={() => {
                if (userInput.trim()) {
                  setUserInput('');
                  setCoopStep(3);
                }
              }}
              className="w-full px-4 py-3 text-white rounded-lg disabled:opacity-50 transition-colors"
              style={{backgroundColor: '#CB5B40'}}
              onMouseEnter={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#A04932')}
              onMouseLeave={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#CB5B40')}
              disabled={!userInput.trim()}
            >
              Отправить запрос
            </button>
          </div>
        );
      }

      if (coopType === 'аренда помещения') {
        return (
          <div className="space-y-4">
            <div style={{backgroundColor: '#CB5B40'}} className="text-white text-sm p-4 rounded-lg">
              <p>Если вы ищете площадку под мероприятие, мы можем сдать помещение или его часть в ваше распоряжение.</p>
              <p className="text-xs mt-2 opacity-90">Подскажите, на какие даты и время вам необходима аренда галереи? Также просим вас указать, какую часть галереи вы рассматриваете под аренду: помещение полностью или маленький зал.</p>
            </div>
            <div className="border p-3 rounded-lg" style={{backgroundColor: '#CB5B4010', borderColor: '#CB5B40'}}>
              <p className="text-sm" style={{color: '#CB5B40'}}>📄 Презентация с условиями аренды</p>
              <a href="https://disk.yandex.ru/i/b64pBU6Ue9qn1Q" className="underline text-sm" style={{color: '#CB5B40'}}>Скачать PDF</a>
            </div>
            <textarea 
              placeholder="Укажите даты, время и тип аренды..."
              className="w-full p-3 border rounded-lg h-24 focus:outline-none focus:ring-2"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#CB5B40'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
            <button 
              onClick={() => {
                if (userInput.trim()) {
                  setUserInput('');
                  setCoopStep(3);
                }
              }}
              className="w-full px-4 py-3 text-white rounded-lg disabled:opacity-50 transition-colors"
              style={{backgroundColor: '#CB5B40'}}
              onMouseEnter={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#A04932')}
              onMouseLeave={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#CB5B40')}
              disabled={!userInput.trim()}
            >
              Отправить запрос
            </button>
          </div>
        );
      }

      if (coopType === 'другое') {
        return (
          <div className="space-y-4">
            <div style={{backgroundColor: '#CB5B40'}} className="text-white p-4 rounded-lg">
              <p className="text-sm">Опишите, пожалуйста, ваш запрос. Мы направим ваш запрос менеджеру и вернемся с ответом в ближайшее время.</p>
            </div>
            <textarea 
              placeholder="Опишите ваш запрос..."
              className="w-full p-3 border rounded-lg h-32 focus:outline-none focus:ring-2"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#CB5B40'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
            <button 
              onClick={() => {
                if (userInput.trim()) {
                  setUserInput('');
                  setCoopStep(3);
                }
              }}
              className="w-full px-4 py-3 text-white rounded-lg disabled:opacity-50 transition-colors"
              style={{backgroundColor: '#CB5B40'}}
              onMouseEnter={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#A04932')}
              onMouseLeave={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#CB5B40')}
              disabled={!userInput.trim()}
            >
              Отправить запрос
            </button>
          </div>
        );
      }
    }

    if (coopStep === 3) {
      return (
        <div className="space-y-4">
          <div style={{backgroundColor: '#CB5B40'}} className="text-white p-4 rounded-lg">
            <p>Подскажите, у вас остались ещё вопросы?</p>
          </div>
          <div className="space-y-2">
            <button 
              onClick={() => setCoopStep(4)}
              className="w-full bg-white p-3 rounded-lg text-left transition-colors"
              style={{border: '1px solid #CB5B40'}}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#CB5B4010'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
            >
              Да
            </button>
            <button 
              onClick={() => setCoopStep(5)}
              className="w-full bg-white p-3 rounded-lg text-left transition-colors"
              style={{border: '1px solid #CB5B40'}}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#CB5B4010'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
            >
              Нет
            </button>
          </div>
        </div>
      );
    }

    if (coopStep === 4) {
      return (
        <div className="space-y-4">
          <div style={{backgroundColor: '#CB5B40'}} className="text-white p-4 rounded-lg">
            <p className="text-sm">Опишите, пожалуйста, ваш вопрос. Мы направим его менеджеру и вернемся с ответом в ближайшее время.</p>
          </div>
          <textarea 
            placeholder="Введите ваш вопрос..."
            className="w-full p-3 border rounded-lg h-24 focus:outline-none focus:ring-2"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = '#CB5B40'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
          <button 
            onClick={() => {
              if (userInput.trim()) {
                setUserInput('');
                setCoopStep(5);
              }
            }}
            className="w-full px-4 py-3 text-white rounded-lg disabled:opacity-50 transition-colors"
            style={{backgroundColor: '#CB5B40'}}
            onMouseEnter={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#A04932')}
            onMouseLeave={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#CB5B40')}
            disabled={!userInput.trim()}
          >
            Отправить
          </button>
        </div>
      );
    }

    if (coopStep === 5) {
      return (
        <div className="space-y-4">
          <div style={{backgroundColor: '#CB5B40'}} className="text-white p-4 rounded-lg">
            <p>Отлично! Будем ждать вас в гости. Хорошего дня!</p>
          </div>
          <button 
            onClick={resetChat}
            className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Вернуться в главное меню
          </button>
        </div>
      );
    }
  };

  const renderReview = () => (
    <div className="space-y-4">
      <div style={{backgroundColor: '#CB5B40'}} className="text-white p-4 rounded-lg">
        <p>Будем рады вашему отзыву о галерее!</p>
        <p className="text-sm mt-2">Оставьте отзыв на Яндекс Картах:</p>
      </div>
      <a 
        href="https://yandex.ru/maps/org/galereya_tikho/176880862431/reviews/?ll=37.643893%2C55.766800&tab=reviews&z=16.9"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-yellow-500 text-white p-4 rounded-lg text-center font-semibold hover:bg-yellow-600 transition-colors block"
      >
        ⭐ Оставить отзыв на Яндекс Картах
      </a>
      <button 
        onClick={resetChat}
        className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
      >
        Вернуться в главное меню
      </button>
    </div>
  );

  const renderSocial = () => (
    <div className="space-y-4">
      <div style={{backgroundColor: '#CB5B40'}} className="text-white p-4 rounded-lg">
        <p>Подписывайтесь на наши соцсети:</p>
      </div>
      <div className="space-y-2">
        <a 
          href="https://t.me/tihoartgallery" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full bg-white p-3 rounded-lg text-left transition-colors block"
          style={{border: '1px solid #CB5B40'}}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#CB5B4010'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
        >
          📱 Telegram канал
        </a>
        <a 
          href="https://www.instagram.com/tihoartgallery?igsh=MWsyNnRqcjc2Z3RpZQ=="
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full bg-white p-3 rounded-lg text-left transition-colors block"
          style={{border: '1px solid #CB5B40'}}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#CB5B4010'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
        >
          📷 Instagram (запрещен в РФ)
        </a>
        <button 
          onClick={resetChat}
          className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Вернуться в главное меню
        </button>
      </div>
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-4">
      <div style={{backgroundColor: '#CB5B40'}} className="text-white p-4 rounded-lg">
        <p className="font-semibold">Афиша мероприятий:</p>
        <p className="text-sm mt-2">Посмотрите актуальную афишу мероприятий на нашем сайте:</p>
      </div>
      <a 
        href="https://tihogallery.ru/exhibitions"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-blue-500 text-white p-4 rounded-lg text-center font-semibold hover:bg-blue-600 transition-colors block"
      >
        🎭 Полная афиша на сайте
      </a>
      <button 
        onClick={resetChat}
        className="w-full px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
      >
        Вернуться в главное меню
      </button>
    </div>
  );

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return renderWelcome();
      case 'purchase':
        return renderPurchase();
      case 'cooperation':
        return renderCooperation();
      case 'review':
        return renderReview();
      case 'social':
        return renderSocial();
      case 'events':
        return renderEvents();
      default:
        return renderWelcome();
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-in overflow-hidden shadow-lg p-2">
            <img 
              src="/logo.png" 
              alt="ТИХО Gallery" 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<div className="w-full h-full rounded-full flex items-center justify-center text-white font-bold" style="background-color: #CB5B40;">Т</div>';
              }}
            />
          </div>
          <p className="text-gray-600">Загрузка ТИХО Gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-gray-100 min-h-screen">
      <style jsx>{`
        /* Все новые анимации из React компонента */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInFromRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes wiggle {
          0%, 7% { transform: rotateZ(0); }
          15% { transform: rotateZ(-15deg); }
          20% { transform: rotateZ(10deg); }
          25% { transform: rotateZ(-10deg); }
          30% { transform: rotateZ(6deg); }
          35% { transform: rotateZ(-4deg); }
          40%, 100% { transform: rotateZ(0); }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px rgba(203, 91, 64, 0.5); }
          50% { box-shadow: 0 0 20px rgba(203, 91, 64, 0.8); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes neonPulse {
          0%, 100% { box-shadow: 0 0 5px #CB5B40; }
          50% { box-shadow: 0 0 20px #CB5B40; }
        }
        .animate-wiggle { animation: wiggle 1s ease-in-out; }
        .animate-heartbeat { animation: heartbeat 1.5s ease-in-out infinite; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-neon-pulse { animation: neonPulse 2s ease-in-out infinite; }
        .ripple-effect { position: relative; overflow: hidden; }
        .gradient-border {
          background: linear-gradient(white, white) padding-box,
                      linear-gradient(45deg, #CB5B40, #A04932) border-box;
          border: 2px solid transparent;
        }
        .shadow-glow { box-shadow: 0 0 20px rgba(203, 91, 64, 0.3); }
        .micro-bounce:hover { animation: elasticIn 0.3s ease-out; }
      `}</style>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInFromRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInFromLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-slide-in-right {
          animation: slideInFromRight 0.3s ease-out forwards;
        }
        .animate-slide-in-left {
          animation: slideInFromLeft 0.3s ease-out forwards;
        }
        .animate-bounce-in {
          animation: bounceIn 0.5s ease-out forwards;
        }
        .animate-pulse-hover:hover {
          animation: pulse 0.3s ease-in-out;
        }
        .transition-smooth {
          transition: all 0.2s ease-in-out;
        }
        .transition-transform {
          transition: transform 0.15s ease-in-out;
        }
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(203, 91, 64, 0.15);
        }
        .button-press:active {
          transform: scale(0.98);
        }
        .fade-transition {
          transition: opacity 0.15s ease-in-out;
        }
        .fade-out {
          opacity: 0.3;
        }
      `}</style>
      {/* Header */}
      <div className="text-white p-4 flex items-center space-x-3 sticky top-0 z-10 shadow-sm" style={{backgroundColor: '#CB5B40'}}>
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden p-1">
          <img 
            src="/logo.png" 
            alt="ТИХО Gallery" 
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-xs" style="background-color: #CB5B40;">Т</div>';
            }}
          />
        </div>
        <div>
          <h1 className="font-semibold">ТИХО Gallery Bot</h1>
          <p className="text-xs opacity-75">онлайн</p>
        </div>
      </div>

      {/* Chat Content */}
      <div className={`p-4 pb-20 fade-transition ${isTransitioning ? 'fade-out' : ''}`}>
        {renderCurrentScreen()}
      </div>

      {/* Bottom Navigation */}
      {currentScreen !== 'welcome' && (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t p-3 shadow-lg">
          <button 
            onClick={resetChat}
            className="w-full py-2 text-sm font-medium rounded transition-colors"
            style={{color: '#CB5B40'}}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#CB5B4010'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            ← Главное меню
          </button>
        </div>
      )}
    </div>
  );
};

export default TihoTelegramBot;
