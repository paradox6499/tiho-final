import React, { useState, useEffect } from 'react';

const TihoTelegramBot = () => {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [isLoading, setIsLoading] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [purchaseStep, setPurchaseStep] = useState(1);
  const [coopStep, setCoopStep] = useState(1);
  const [eventsStep, setEventsStep] = useState(1);
  const [coopType, setCoopType] = useState('');
  const [purchaseData, setPurchaseData] = useState({});

  useEffect(() => {
    // Telegram Web App инициализация
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      
      // Настройка темы
      tg.setHeaderColor('#ea580c');
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

    // Имитация загрузки приложения
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentScreen]);

  const resetChat = () => {
    setCurrentScreen('welcome');
    setPurchaseStep(1);
    setCoopStep(1);
    setEventsStep(1);
    setCoopType('');
    setPurchaseData({});
    setUserInput('');
  };

  const handleMainAction = (action) => {
    setCurrentScreen(action);
  };

  const renderWelcome = () => (
    <div className="space-y-4">
      <div className="bg-orange-600 text-white p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden p-1">
            <img 
              src="https://i.imgur.com/tiho-logo.jpg" 
              alt="ТИХО Gallery" 
              className="w-full h-full object-contain"
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
          className="w-full bg-white border border-orange-200 p-3 rounded-lg text-left hover:bg-orange-50 transition-colors"
        >
          📖 Приобрести работу
        </button>
        <button 
          onClick={() => handleMainAction('cooperation')}
          className="w-full bg-white border border-orange-200 p-3 rounded-lg text-left hover:bg-orange-50 transition-colors"
        >
          🤝 Уточнить условия сотрудничества
        </button>
        <button 
          onClick={() => handleMainAction('review')}
          className="w-full bg-white border border-orange-200 p-3 rounded-lg text-left hover:bg-orange-50 transition-colors"
        >
          ⭐ Оставить отзыв
        </button>
        <button 
          onClick={() => handleMainAction('social')}
          className="w-full bg-white border border-orange-200 p-3 rounded-lg text-left hover:bg-orange-50 transition-colors"
        >
          📱 Соцсети
        </button>
        <button 
          onClick={() => handleMainAction('events')}
          className="w-full bg-white border border-orange-200 p-3 rounded-lg text-left hover:bg-orange-50 transition-colors"
        >
          📅 Афиша мероприятий на месяц
        </button>
      </div>
    </div>
  );

  const renderPurchase = () => {
    if (purchaseStep === 1) {
      return (
        <div className="space-y-4">
          <div className="bg-orange-600 text-white p-4 rounded-lg">
            <p>Отлично! Подскажите, какая работа вас интересует?</p>
            <p className="text-sm mt-2">Пришлите, пожалуйста, ссылку на интересующую вас работу с нашего сайта</p>
            <a href="https://tihogallery.ru/art" className="text-white underline">https://tihogallery.ru/art</a>
          </div>
          <div className="flex space-x-2">
            <input 
              type="text" 
              placeholder="Введите ссылку на работу..."
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <button 
              onClick={() => {
                if (userInput.trim()) {
                  setPurchaseData({...purchaseData, workLink: userInput});
                  setUserInput('');
                  setPurchaseStep(2);
                }
              }}
              className="px-4 py-3 bg-orange-600 text-white rounded-lg disabled:opacity-50 hover:bg-orange-700 transition-colors"
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
          <div className="bg-orange-600 text-white p-4 rounded-lg">
            <p>Подскажите, как вам было бы удобно оплатить покупку?</p>
          </div>
          <div className="space-y-2">
            {['по ссылке', 'по QR', 'по счету', 'наличными при самовывозе'].map(option => (
              <button 
                key={option}
                onClick={() => {
                  setPurchaseData({...purchaseData, paymentMethod: option});
                  setPurchaseStep(3);
                }}
                className="w-full bg-white border border-orange-200 p-3 rounded-lg text-left hover:bg-orange-50 transition-colors"
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
          <div className="bg-orange-600 text-white p-4 rounded-lg">
            <p>Спасибо! Подскажите, вам понадобится доставка?</p>
          </div>
          <div className="space-y-2">
            <button 
              onClick={() => {
                setPurchaseData({...purchaseData, delivery: true});
                setPurchaseStep(4);
              }}
              className="w-full bg-white border border-orange-200 p-3 rounded-lg text-left hover:bg-orange-50 transition-colors"
            >
              Да
            </button>
            <button 
              onClick={() => {
                setPurchaseData({...purchaseData, delivery: false});
                setPurchaseStep(5);
              }}
              className="w-full bg-white border border-orange-200 p-3 rounded-lg text-left hover:bg-orange-50 transition-colors"
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
          <div className="bg-orange-600 text-white text-sm p-4 rounded-lg">
            <p>Отлично! Введите, пожалуйста, ваши ФИО и контактный номер телефона, реквизиты при оплате от юр.лиц, полный адрес доставки, а также контакты получателя. Все данные конфиденциальны и не подлежат передаче третьим лицам.</p>
            <p className="text-xs mt-2 opacity-90">Обращаем внимание, что доставка оплачивается отдельно. После расчета стоимости наш менеджер свяжется с вами для уточнения деталей.</p>
          </div>
          <textarea 
            placeholder="Введите все необходимые данные..."
            className="w-full p-3 border rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button 
            onClick={() => {
              if (userInput.trim()) {
                setPurchaseData({...purchaseData, deliveryInfo: userInput});
                setUserInput('');
                setPurchaseStep(6);
              }
            }}
            className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg disabled:opacity-50 hover:bg-orange-700 transition-colors"
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
          <div className="bg-orange-600 text-white text-sm p-4 rounded-lg">
            <p>Отлично! Забрать работу самостоятельно можно из пространства галереи по адресу г. Москва, Малый Харитоньевский переулок, д. 6с2 со вторника по субботу с 12:00 до 20:00.</p>
            <p className="text-xs mt-2 opacity-90">Просим заранее предупредить о своем визите как минимум за день, чтобы наша команда успела подготовить все документы и работу к выдаче. Заранее спасибо!</p>
            <p className="text-xs mt-2 opacity-90">Также укажите, пожалуйста, ваши ФИО и контактный номер телефона / реквизиты при оплате от юр.лиц. Все данные конфиденциальны и не подлежат передаче третьим лицам.</p>
          </div>
          <textarea 
            placeholder="Введите ваши данные..."
            className="w-full p-3 border rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button 
            onClick={() => {
              if (userInput.trim()) {
                setPurchaseData({...purchaseData, pickupInfo: userInput});
                setUserInput('');
                setPurchaseStep(6);
              }
            }}
            className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg disabled:opacity-50 hover:bg-orange-700 transition-colors"
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
          <div className="bg-orange-600 text-white p-4 rounded-lg">
            <p className="text-sm">Спасибо! Пока наши менеджеры обрабатывают запрос, вы можете ознакомиться с договором-офертой по данной ссылке:</p>
            <a href="https://tihogallery.ru/faq#rec790264355" className="text-white underline text-sm">https://tihogallery.ru/faq#rec790264355</a>
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
          <div className="bg-orange-600 text-white p-4 rounded-lg">
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
                className="w-full bg-white border border-orange-200 p-3 rounded-lg text-left hover:bg-orange-50 transition-colors"
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
            <div className="bg-orange-600 text-white text-sm p-4 rounded-lg">
              <p>Отлично! Если вы хотите стать художником нашей галереи, вам необходимо прислать ваше портфолио в формате PDF (не больше 25мб) с указанием названия и цены работ, а также полное актуальное CV в формате PDF на нашу почту info@tihogallery.ru.</p>
              <p className="text-xs mt-2 opacity-90">В теме письма необходимо указать «новый художник ТИХО». В противном случае ваше письмо просто потеряется.</p>
            </div>
            <button 
              onClick={() => setCoopStep(3)}
              className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Понятно, спасибо!
            </button>
          </div>
        );
      }

      if (coopType === 'я дизайнер') {
        return (
          <div className="space-y-4">
            <div className="bg-orange-600 text-white text-sm p-4 rounded-lg">
              <p>Отлично! Мы сотрудничаем с дизайнерами, декораторами и архитекторами. Вы можете взять наши работы на съёмку или примерку. Для аренды на съёмку вам необходимо будет оплатить транспортные расходы из галереи и обратно, а также указать галерею при публикации и любом использовании изображений произведений искусства.</p>
              <p className="text-xs mt-2 opacity-90">Опишите, пожалуйста, что вас интересует? Укажите желаемые даты и время съёмки/примерки, а также по возможности пришлите ссылки на интересующие вас работы с нашего сайта https://tihogallery.ru/art</p>
            </div>
            <textarea 
              placeholder="Опишите ваш запрос..."
              className="w-full p-3 border rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <button 
              onClick={() => {
                if (userInput.trim()) {
                  setUserInput('');
                  setCoopStep(3);
                }
              }}
              className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg disabled:opacity-50 hover:bg-orange-700 transition-colors"
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
            <div className="bg-orange-600 text-white text-sm p-4 rounded-lg">
              <p>Если вы ищете площадку под мероприятие, мы можем сдать помещение или его часть в ваше распоряжение.</p>
              <p className="text-xs mt-2 opacity-90">Подскажите, на какие даты и время вам необходима аренда галереи? Также просим вас указать, какую часть галереи вы рассматриваете под аренду: помещение полностью или маленький зал.</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
              <p className="text-sm text-orange-800">📄 Презентация с условиями аренды</p>
              <a href="https://disk.yandex.ru/i/b64pBU6Ue9qn1Q" className="text-orange-600 underline text-sm hover:text-orange-700">Скачать PDF</a>
            </div>
            <textarea 
              placeholder="Укажите даты, время и тип аренды..."
              className="w-full p-3 border rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <button 
              onClick={() => {
                if (userInput.trim()) {
                  setUserInput('');
                  setCoopStep(3);
                }
              }}
              className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg disabled:opacity-50 hover:bg-orange-700 transition-colors"
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
            <div className="bg-orange-600 text-white p-4 rounded-lg">
              <p className="text-sm">Опишите, пожалуйста, ваш запрос. Мы направим ваш запрос менеджеру и вернемся с ответом в ближайшее время.</p>
            </div>
            <textarea 
              placeholder="Опишите ваш запрос..."
              className="w-full p-3 border rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <button 
              onClick={() => {
                if (userInput.trim()) {
                  setUserInput('');
                  setCoopStep(3);
                }
              }}
              className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg disabled:opacity-50 hover:bg-orange-700 transition-colors"
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
          <div className="bg-orange-600 text-white p-4 rounded-lg">
            <p>Подскажите, у вас остались ещё вопросы?</p>
          </div>
          <div className="space-y-2">
            <button 
              onClick={() => setCoopStep(4)}
              className="w-full bg-white border border-orange-200 p-3 rounded-lg text-left hover:bg-orange-50 transition-colors"
            >
              Да
            </button>
            <button 
              onClick={() => setCoopStep(5)}
              className="w-full bg-white border border-orange-200 p-3 rounded-lg text-left hover:bg-orange-50 transition-colors"
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
          <div className="bg-orange-600 text-white p-4 rounded-lg">
            <p className="text-sm">Опишите, пожалуйста, ваш вопрос. Мы направим его менеджеру и вернемся с ответом в ближайшее время.</p>
          </div>
          <textarea 
            placeholder="Введите ваш вопрос..."
            className="w-full p-3 border rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button 
            onClick={() => {
              if (userInput.trim()) {
                setUserInput('');
                setCoopStep(5);
              }
            }}
            className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg disabled:opacity-50 hover:bg-orange-700 transition-colors"
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
          <div className="bg-orange-600 text-white p-4 rounded-lg">
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
      <div className="bg-orange-600 text-white p-4 rounded-lg">
        <p>Спасибо за интерес к отзывам! Функция уже работает, спасибо!</p>
      </div>
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
      <div className="bg-orange-600 text-white p-4 rounded-lg">
        <p>Подписывайтесь на наши соцсети:</p>
      </div>
      <div className="space-y-2">
        <a 
          href="https://t.me/tihoartgallery" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full bg-white border border-orange-200 p-3 rounded-lg text-left hover:bg-orange-50 transition-colors block"
        >
          📱 Telegram канал
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

  const renderEvents = () => {
    if (eventsStep === 1) {
      return (
        <div className="space-y-4">
          <div className="bg-orange-600 text-white p-4 rounded-lg">
            <p className="font-semibold">Афиша мероприятий на февраль:</p>
          </div>
          <button 
            onClick={() => setEventsStep(2)}
            className="w-full bg-white border border-orange-200 p-3 rounded-lg text-left hover:bg-orange-50 transition-colors"
          >
            1) Групповая выставка «ПРОКРАСТИНАЦИЯ КАК ПРЕДЧУВСТВИЕ ГРАНДИОЗНОГО»
          </button>
          <button 
            onClick={resetChat}
            className="w-full px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Вернуться в главное меню
          </button>
        </div>
      );
    }

    if (eventsStep === 2) {
      return (
        <div className="space-y-4">
          <div className="bg-orange-600 text-white p-4 rounded-lg text-sm">
            <p className="font-semibold mb-2">Групповая выставка «Прокрастинация как предчувствие грандиозного»</p>
            <p className="mb-2 text-xs opacity-90">14 февраля галерея ТИХО открыла групповую выставку «Прокрастинация как предчувствие грандиозного», которая предложит зрителям замедлить поток мыслей, посмотреть на себя и свою идею со стороны: полюбоваться ее неидельными формами, угловатостью, недосказанностью и странными переходами.</p>
            <p className="mb-2 text-xs opacity-90">В выставке примут участие: Ян Тихоненко, Оксана Афанасьева, Марина Черкасова, Анастасия Успенская, Александр Волков, Радмила Мигулина, Вероника Кудашова, Аня Мохова, Мария Стадник, Аня Гросицкая, Юлия Живичина, Варвара Гранкова.</p>
            <div className="bg-orange-700 p-2 rounded mt-3 text-xs">
              <p><strong>Что:</strong> выставка «Прокрастинация как предчувствие грандиозного»</p>
              <p><strong>Где:</strong> галерея ТИХО, Малый Харитоньевский пер., 6, стр. 2 (второй этаж)</p>
              <p><strong>Когда:</strong> 14 февраля – 12 апреля</p>
              <p><strong>Возрастная категория:</strong> +16</p>
              <p><strong>Вход:</strong> 200 ₽</p>
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
            <p className="text-sm text-orange-800">📸 Фото выставки</p>
            <a href="https://disk.yandex.ru/i/JfR9CK7MTj23jA" className="text-orange-600 underline text-sm hover:text-orange-700">Посмотреть</a>
          </div>
          <a 
            href="https://tihogallery.ru/procrastination#popup:timepad"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-green-500 text-white p-4 rounded-lg text-center font-semibold hover:bg-green-600 transition-colors block"
          >
            🎫 Купить билет
          </a>
          <button 
            onClick={resetChat}
            className="w-full px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Вернуться в главное меню
          </button>
        </div>
      );
    }
  };

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
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse overflow-hidden shadow-lg p-2">
            <img 
              src="https://i.imgur.com/tiho-logo.jpg" 
              alt="ТИХО Gallery" 
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-gray-600">Загрузка ТИХО Gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-orange-600 text-white p-4 flex items-center space-x-3 sticky top-0 z-10 shadow-sm">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden p-1">
          <img 
            src="https://i.imgur.com/tiho-logo.jpg" 
            alt="ТИХО Gallery" 
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <h1 className="font-semibold">ТИХО Gallery Bot</h1>
          <p className="text-xs opacity-75">онлайн</p>
        </div>
      </div>

      {/* Chat Content */}
      <div className="p-4 pb-20">
        {renderCurrentScreen()}
      </div>

      {/* Bottom Navigation */}
      {currentScreen !== 'welcome' && (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t p-3 shadow-lg">
          <button 
            onClick={resetChat}
            className="w-full py-2 text-orange-600 text-sm font-medium hover:bg-orange-50 rounded transition-colors"
          >
            ← Главное меню
          </button>
        </div>
      )}
    </div>
  );
};

export default TihoTelegramBot;
