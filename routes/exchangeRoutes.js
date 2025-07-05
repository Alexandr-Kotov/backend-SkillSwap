router.post('/', exchangeController.sendRequest);
router.get('/my', exchangeController.getMyRequests);