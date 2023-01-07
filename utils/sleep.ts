export const sleep = async (timeout = 3000) => await (
    new Promise((res) => setTimeout(() => {res(true)}, timeout))
)