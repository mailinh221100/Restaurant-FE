import { Chart, Geom, Axis, Tooltip, Coord, Label, Legend } from 'bizcharts';

const Donut = ({ data }: any) => {
  const cols = {
    count: {
      formatter: (val: any) => {
        return val;
      },
    },
  };

  return (
    <div>
      <Chart
        height={window.innerHeight}
        data={data}
        scale={cols}
        padding={[80, 100, 80, 80]}
        forceFit
      >
        <Coord type={'theta'} radius={0.75} innerRadius={0.6} />
        <Axis name="count" />
        <Legend position="bottom" />
        <Tooltip
          showTitle={false}
          itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
        />
        <Geom
          type="intervalStack"
          position="count"
          color="item"
          tooltip={[
            'item*percent',
            (item, count) => {
              return {
                name: item,
                value: count,
              };
            },
          ]}
          style={{
            lineWidth: 1,
            stroke: '#fff',
          }}
        >
          <Label
            content="count"
            formatter={(val, item) => {
              return item.point.item + ': ' + val;
            }}
          />
        </Geom>
      </Chart>
    </div>
  );
};

export default Donut;
