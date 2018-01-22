var chart = c3.generate({
    bindto: '#chart2',
    data: {
        columns: [
            cdata
        ],
        types: {
            data1: 'area-spline',
        },
         colors: {
           data1: 'lightblue',
         }
    }
});
