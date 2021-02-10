
Cette card est compatible avec HACS et utilise le sensor : https://github.com/saniho/apiMareeInfo

```
type: 'custom:content-card-maree'
entity: sensor.myport_124_mareedujour
showIcon: false
showNextMaree: true
showTitle: true
showEtatNextMaree: true
showNextMareesDetail: false
```

pour voir les deux prochaines marées : 
```
type: 'custom:content-card-maree'
entity: sensor.myport_124_mareedujour
showIcon: false
showNextMaree: false
showEtatNextMaree: false
showNextMareesDetail: true
showTitle: true
```

