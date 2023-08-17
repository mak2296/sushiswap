import { Network } from 'aptos'
const CONTRACT_ADDRESS = process.env['SWAP_CONTRACT'] || process.env['NEXT_PUBLIC_SWAP_CONTRACT']
export function payloadArgs(amount_in: number, routes: any, minimumOut: number) {
  switch (routes.length) {
    case 2:
      return {
        type: 'entry_function_payload',
        type_arguments: [routes[0], routes[1]],
        arguments: [amount_in, minimumOut],
        function: `${CONTRACT_ADDRESS}::router::swap_exact_input`,
      }
      break
    case 3:
      return {
        type: 'entry_function_payload',
        type_arguments: [routes[0], routes[1], routes[2]],
        arguments: [amount_in, minimumOut],
        function: `${CONTRACT_ADDRESS}::router::swap_exact_input_doublehop`,
      }
      break
    case 4:
      return {
        type: 'entry_function_payload',
        type_arguments: [routes[0], routes[1], routes[2], routes[3]],
        arguments: [amount_in, minimumOut],
        function: `${CONTRACT_ADDRESS}::router::swap_exact_input_triplehop`,
      }
      break
    case 5:
      return {
        type: 'entry_function_payload',
        type_arguments: [routes[0], routes[1], routes[2], routes[3], routes[4]],
        arguments: [amount_in, minimumOut],
        function: `${CONTRACT_ADDRESS}::router::swap_exact_input_quadruplehop`,
      }
      break
    default:
      return undefined
  }
  return undefined
}
