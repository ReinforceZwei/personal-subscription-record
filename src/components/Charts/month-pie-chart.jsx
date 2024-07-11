import { PieChart } from '@mui/x-charts/PieChart';
import { useGetMonthTypeSumByYearMonthQuery } from "../../redux/recordSlice"
import { useGetTypesQuery } from '../../redux/typeSlice';
import { useMemo } from 'react';
import { keyBy, groupBy, sortBy } from 'lodash-es'
import { Skeleton } from '@mui/material'



const MonthPieChartProps = {
    year: 0,
    month: 0,
}

export default function MonthPieChart(props = MonthPieChartProps) {
    const { year, month } = props

    const { data, isFetching } = useGetMonthTypeSumByYearMonthQuery({ year, month })
    const { data: types, isFetching: isTagFetching } = useGetTypesQuery()

    const seriesData = useMemo(() => {
        if (data && types) {
            const typesById = keyBy(types, x => x.id)

            return data.map(x => ({
                id: x.type,
                value: x.price,
                label: typesById[x.type].name,
                color: typesById[x.type].color,
            }))
        }
        return []
    }, [data, types])

    return (
        <>
        { (isFetching || isTagFetching) ? (<Skeleton variant="rounded" height={400} />) : (
            <PieChart
                series={[{
                    data: seriesData,
                    innerRadius: 80,
                    //arcLabel: (item) => `${item.label} (${item.value})`
                }]}
                height={400}
                slotProps={{
                    legend: {
                        //position: { vertical: 'top', horizontal: 'middle' },
                        //direction: 'row',
                    },
                }}
            />
        ) }
        </>
    )
}