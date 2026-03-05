-- Permitir INSERT em politicas_acesso para usuários autenticados
create policy "authenticated insert policies" on politicas_acesso
  for insert
  to authenticated
  with check (true);

-- Permitir UPDATE em politicas_acesso para usuários autenticados
create policy "authenticated update policies" on politicas_acesso
  for update
  to authenticated
  using (true)
  with check (true);

-- Permitir DELETE em politicas_acesso para usuários autenticados
create policy "authenticated delete policies" on politicas_acesso
  for delete
  to authenticated
  using (true);
