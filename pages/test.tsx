export default function Test() {
  return (
    <table className="w-full border border-blue-900 border-collapse">
      

      <thead>
        <tr>
          <th className="border border-blue-900">A</th>
          <th className="border border-blue-900">B</th>
        </tr>
      </thead>
      <tbody>
        <tr>
        <td style={{ border: "1px solid red" }}>X</td>
          
          <td className="border border-blue-900">Y</td>
        </tr>
      </tbody>
    </table>
  );
}
