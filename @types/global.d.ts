

    interface String {
        readonly int: number
    }


    interface Array {
        groupBy<T>(this: T[], keyName: keyof T): Record<number, T[]>
    }
