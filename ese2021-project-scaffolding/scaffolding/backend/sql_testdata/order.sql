INSERT INTO "order"(orderId, firstName, lastName, street, houseNr, zip, city, paymentOption, orderStatus, user, createdAt, updatedAt, ProductProductId)
VALUES  (/* orderId: */ 1, 'Joachim', 'Bauer', 'Im Feld', '36', '1234', 'Bauernstadt', /* paymentOption: */ 1, /* orderStatus: */ 1, 5, DATE(), DATE(), 1) /* user: */
   ,    (2, 'Maximilian', 'von Gutenberg', 'HSG', '1', '9000', 'St. Gallen', 2, 1, 2, /* createdAt: */ DATE (), /* updatedAt: */ DATE (), /* ProductProductId: */ 3);
