import { useState } from 'react'

/* Есть следующие структуры данных, описывающих товар – интерфейс Model и набор
параметров этого товара. Необходимо реализовать на React компоненты, которые
позволяют редактировать структуру Model – проставлять значения параметров при
этом параметры должны выводиться все и сразу должны быть доступны для
редактирования, а переданные значения в структуре проставлены в форме
редактирования, которые передаются в params: Param[], а так же позволяют получить
полную структуру в методе getModel() – содержащую все проставленные значения
параметров. Решение должно быть легко расширяемым (например, позволять легко
добавлять новые типы параметров – не только текстовые, но например числовые или
со списком значений) Ваша реализация должна работать только с текстовыми
параметрами Input – тип string.
Решение необходимо оформить в виде одного файла со всеми компонентами и типами
которые используются. */

const ParamInput = ({
  id,
  name,
  value,
  onChange,
}: {
  id: number
  name: Param['name']
  value: ParamValue<string>['value'] | undefined
  onChange: (value: ParamValue<string>['value'], id: number) => void
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-900">{name}</label>
      <input
        type="text"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
        value={value}
        onChange={(e) => onChange(e.target.value, id)}
      />
    </div>
  )
}

const ParamEditor = <T extends number | string | unknown[]>({
  model,
  params,
}: Props<T>) => {
  const [valuesByParamIdDict, setValuesByParamIdDict] = useState(() => {
    const dict: Record<
      number,
      {
        id: number
        value: ParamValue<T>['value'] | undefined
        name: Param['name']
      }
    > = {}

    for (const param of params) {
      dict[param.id] = { id: param.id, name: param.name, value: undefined }
    }

    for (const paramValue of model.paramValues) {
      dict[paramValue.paramId] = {
        ...dict[paramValue.paramId],
        value: paramValue.value,
      }
    }

    return dict
  })

  const getModel = () => {
    return Object.values(valuesByParamIdDict)
  }

  const onParamInputChange = (value: T, id: number) => {
    setValuesByParamIdDict((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        value,
      },
    }))
  }

  const renderParams = () => {
    return params.map((param) => {
      const value = valuesByParamIdDict[param.id].value
      if (param.type === 'string' && typeof value === 'string') {
        return (
          <ParamInput
            id={param.id}
            key={param.id}
            name={param.name}
            value={value}
            onChange={(value) => onParamInputChange(value as T, param.id)}
          />
        )
      }
      // Handle other types here if needed
      return null
    })
  }

  return (
    <div className="flex flex-col gap-4 w-1/3">
      {renderParams()}
      <button
        type="button"
        onClick={() => console.log(getModel())}
        className="w-1/2 text-white bg-blue-700 cursor-pointer hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none"
      >
        get model
      </button>
    </div>
  )
}

function App() {
  return (
    <ParamEditor
      model={{
        paramValues: [
          {
            paramId: 1,
            value: 'повседневное',
          },
          {
            paramId: 2,
            value: 'макси',
          },
        ],
      }}
      params={[
        {
          id: 1,
          name: 'Назначение',
          type: 'string',
        },
        {
          id: 2,
          name: 'Длина',
          type: 'string',
        },
      ]}
    />
  )
}

export default App
interface Param {
  id: number
  name: string
  type: 'string'
}

interface ParamValue<T> {
  paramId: number
  value: T
}
interface Model<T> {
  paramValues: ParamValue<T>[]
  // colors: Color[]
}
interface Props<T> {
  params: Param[]
  model: Model<T>
}
