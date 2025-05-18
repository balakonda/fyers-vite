graph TD
    subgraph User Clients
        WebApp[Web Application B2C/B2B/Admin]
        MobileApp[Mobile Application B2C]
    end

    subgraph External Systems
        BrokerAPIs[Broker APIs <br/> (Delta.xchange, Binance, etc.)]
        PaymentGW[Payment Gateways]
        MarketDataFeeds[External Market Data Feeds]
    end

    APIGateway[API Gateway <br/> (Auth, Rate Limit, Routing)]

    WebApp --> APIGateway
    MobileApp --> APIGateway

    subgraph Core Backend Microservices
        UserSvc[User & Account Mgmt Service]
        StrategyMgmtSvc[Strategy Mgmt & Backtesting Service]
        MarketDataIngSvc[Market Data Ingestion Service]
        TradingEngineSvc[Strategy Execution Service / Trading Engine]
        OrderOrchSvc[Order Orchestration & Broker Integration Service <br/> (Provider Layer)]
        PortfolioPnLSvc[Portfolio & P&L Service]
        NotificationSvc[Notification Service]
        PaymentSubSvc[Payment & Subscription Service]
        BackofficeSvc[Backoffice & Reporting Service]
    end

    APIGateway --> UserSvc
    APIGateway --> StrategyMgmtSvc
    APIGateway --> TradingEngineSvc
    APIGateway --> PortfolioPnLSvc
    APIGateway --> PaymentSubSvc
    APIGateway --> BackofficeSvc
    APIGateway --> NotificationSvc

    MessageBus[Message Bus <br/> (e.g., Kafka, RabbitMQ)]

    MarketDataIngSvc -- Publishes Market Data --> MessageBus
    TradingEngineSvc -- Subscribes to Market Data & Signals --> MessageBus
    OrderOrchSvc -- Publishes Order Status --> MessageBus
    PortfolioPnLSvc -- Subscribes to Order Status --> MessageBus
    NotificationSvc -- Subscribes to Events --> MessageBus

    TradingEngineSvc -- Order Requests --> OrderOrchSvc
    OrderOrchSvc -- Trade Execution --> BrokerAPIs
    OrderOrchSvc -- Account Info --> BrokerAPIs

    MarketDataIngSvc -- Fetches Data --> BrokerAPIs
    MarketDataIngSvc -- Fetches Data --> MarketDataFeeds

    PaymentSubSvc --> PaymentGW

    subgraph Data Stores
        UserDB[(User DB <br/> e.g., PostgreSQL)]
        StrategyDB[(Strategy DB <br/> e.g., MongoDB/PostgreSQL)]
        MarketDataDB[(Market Data DB <br/> e.g., TimescaleDB/InfluxDB)]
        TradeDB[(Trade & Position DB <br/> e.g., PostgreSQL)]
        ConfigDB[(Config DB <br/> e.g., Consul/Relational)]
        Cache[(Cache <br/> e.g., Redis)]
    end

    UserSvc --> UserDB
    UserSvc --> Cache
    StrategyMgmtSvc --> StrategyDB
    StrategyMgmtSvc --> MarketDataDB  // For backtesting
    MarketDataIngSvc --> MarketDataDB
    TradingEngineSvc --> StrategyDB // For strategy logic
    TradingEngineSvc --> Cache // For fast data access
    OrderOrchSvc --> TradeDB
    OrderOrchSvc --> Cache
    PortfolioPnLSvc --> TradeDB
    PortfolioPnLSvc --> MarketDataDB
    PortfolioPnLSvc --> Cache
    PaymentSubSvc --> UserDB
    BackofficeSvc --> UserDB
    BackofficeSvc --> StrategyDB
    BackofficeSvc --> TradeDB

    AllCoreServices --> ConfigDB

    subgraph Observability
        Logging[Logging <br/> (ELK Stack)]
        Metrics[Metrics <br/> (Prometheus, Grafana)]
        Tracing[Tracing <br/> (Jaeger)]
        Alerting[Alerting System]
    end

    CoreBackendMicroservices -- Logs/Metrics/Traces --> Observability
    APIGateway -- Logs/Metrics/Traces --> Observability
    Observability -- Alerts --> NotificationSvc

    style UserSvc fill:#bbf,stroke:#333,stroke-width:2px
    style StrategyMgmtSvc fill:#bbf,stroke:#333,stroke-width:2px
    style MarketDataIngSvc fill:#f9f,stroke:#333,stroke-width:2px
    style TradingEngineSvc fill:#f9f,stroke:#333,stroke-width:2px
    style OrderOrchSvc fill:#f9f,stroke:#333,stroke-width:2px
    style PortfolioPnLSvc fill:#bbf,stroke:#333,stroke-width:2px
    style NotificationSvc fill:#bbf,stroke:#333,stroke-width:2px
    style PaymentSubSvc fill:#bbf,stroke:#333,stroke-width:2px
    style BackofficeSvc fill:#bbf,stroke:#333,stroke-width:2px

    style MarketDataDB fill:#ccf,stroke:#333,stroke-width:2px
    style TradeDB fill:#ccf,stroke:#333,stroke-width:2px