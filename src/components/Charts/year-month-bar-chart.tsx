import { BarChart } from '@mui/x-charts/BarChart';
import { useGetMonthTypeSumByYearQuery } from "../../redux/recordSlice"
import { useMemo } from 'react';
import { keyBy, groupBy, sortBy } from 'lodash-es'
import { useGetTypesQuery } from '../../redux/typeSlice';
import { Skeleton } from '@mui/material'

const xAxisLabels = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'
]

interface YearMonthBarChartProps {
    year: number
}

export default function YearMonthBarChart(props: YearMonthBarChartProps) {
    const { year } = props

    const { data, isFetching } = useGetMonthTypeSumByYearQuery(year)
    const { data: types, isFetching: isTagFetching } = useGetTypesQuery()

    const chartSeries = useMemo(() => {
        let series = []
        if (data && types) {
            const byType = groupBy(data, x => x.type)
            const typesById = keyBy(types, x => x.id)
            
            for (let key of Object.keys(byType)) {
                let p = new Array(12).fill(0)
                
                byType[key].forEach(x => {
                    p[Number(x.month) - 1] = x.price
                })
                //p[byType[key].month] = byType[key].price
                let t = {
                    data: p, label: typesById[key].name, id: key, color: typesById[key].color, stack: 'total', stackOrder: 'appearance' as const
                }
                series.push(t)
            }
        }
        return series
    }, [data, types])
    return (
        <>
            { isFetching ? (
                <Skeleton variant="rounded" height={400} />
            ) : (
                (<BarChart
                    //dataset={data}
                    xAxis={[
                        { scaleType: 'band', data: xAxisLabels },
                    ]}
                    series={chartSeries}
                    height={400}
                />)
                //<div></div>
            )}
        </>
    );
}