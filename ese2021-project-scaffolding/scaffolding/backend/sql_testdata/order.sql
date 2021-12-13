INSERT INTO "order"(orderId, firstName, lastName, street, houseNr, zip, city, paymentOption, orderStatus, user, createdAt, updatedAt, ProductProductId)
VALUES  (/* orderId: */ 1, 'Joachim', 'Bauer', 'Im Feld', '36', '1234', 'Bauernstadt', /* paymentOption: */ 1, /* orderStatus: */ 0, 5, DATE(), DATE(), 1) /* user: */
   ,    (2, 'Maximilian', 'von Gutenberg', 'HSG', '1', '9000', 'St. Gallen', 2, 1, 2, /* createdAt: */ DATE (), /* updatedAt: */ DATE (), /* ProductProductId: */ 3)
   ,    (3, 'Khal', 'Drogo', 'Vaes Dothrak', '1', '4568', 'Essos', 2, 2, 4, /* createdAt: */ DATE (), /* updatedAt: */ DATE (), /* ProductProductId: */ 7);
